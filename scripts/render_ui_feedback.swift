import AppKit

struct Callout {
    let title: String
    let body: String
    let anchor: NSPoint
    let box: NSRect
    let color: NSColor
}

func rectFromTopLeft(_ x: CGFloat, _ y: CGFloat, _ width: CGFloat, _ height: CGFloat, canvasHeight: CGFloat) -> NSRect {
    NSRect(x: x, y: canvasHeight - y - height, width: width, height: height)
}

func drawRoundedRect(_ rect: NSRect, fill: NSColor, stroke: NSColor, lineWidth: CGFloat = 3) {
    fill.setFill()
    NSBezierPath(roundedRect: rect, xRadius: 18, yRadius: 18).fill()
    let path = NSBezierPath(roundedRect: rect, xRadius: 18, yRadius: 18)
    path.lineWidth = lineWidth
    stroke.setStroke()
    path.stroke()
}

func drawCallout(_ callout: Callout, canvasHeight: CGFloat) {
    let stroke = callout.color
    let fill = callout.color.withAlphaComponent(0.10)
    drawRoundedRect(callout.box, fill: fill, stroke: stroke)

    let titleAttrs: [NSAttributedString.Key: Any] = [
        .font: NSFont(name: "Arial Bold", size: 22) ?? NSFont.boldSystemFont(ofSize: 22),
        .foregroundColor: stroke
    ]
    let bodyAttrs: [NSAttributedString.Key: Any] = [
        .font: NSFont(name: "Arial", size: 16) ?? NSFont.systemFont(ofSize: 16),
        .foregroundColor: NSColor(calibratedWhite: 0.18, alpha: 1.0)
    ]

    callout.title.draw(at: NSPoint(x: callout.box.minX + 24, y: callout.box.maxY - 44), withAttributes: titleAttrs)

    let paragraph = NSMutableParagraphStyle()
    paragraph.lineBreakMode = .byWordWrapping
    let wrappedBodyAttrs = bodyAttrs.merging([.paragraphStyle: paragraph]) { _, new in new }
    let bodyRect = NSRect(x: callout.box.minX + 24, y: callout.box.minY + 20, width: callout.box.width - 48, height: callout.box.height - 62)
    (callout.body as NSString).draw(in: bodyRect, withAttributes: wrappedBodyAttrs)

    let anchorDot = NSRect(x: callout.anchor.x - 7, y: callout.anchor.y - 7, width: 14, height: 14)
    stroke.setFill()
    NSBezierPath(ovalIn: anchorDot).fill()

    let start = NSPoint(x: callout.box.midX, y: callout.box.minY)
    let path = NSBezierPath()
    path.move(to: start)
    path.line(to: callout.anchor)
    path.lineWidth = 4
    path.setLineDash([10, 8], count: 2, phase: 0)
    stroke.setStroke()
    path.stroke()
}

guard CommandLine.arguments.count == 3 else {
    fputs("usage: render_ui_feedback.swift <input> <output>\n", stderr)
    exit(1)
}

let inputPath = CommandLine.arguments[1]
let outputPath = CommandLine.arguments[2]

guard let image = NSImage(contentsOfFile: inputPath) else {
    fputs("failed to load input image\n", stderr)
    exit(1)
}

let size = image.size
let outputImage = NSImage(size: size)

let blue = NSColor(calibratedRed: 0.12, green: 0.42, blue: 0.95, alpha: 1.0)
let green = NSColor(calibratedRed: 0.10, green: 0.62, blue: 0.37, alpha: 1.0)
let orange = NSColor(calibratedRed: 0.95, green: 0.54, blue: 0.16, alpha: 1.0)
let purple = NSColor(calibratedRed: 0.51, green: 0.31, blue: 0.93, alpha: 1.0)

outputImage.lockFocus()
image.draw(in: NSRect(origin: .zero, size: size))

// Highlight regions in the mockup.
let workItemRect = rectFromTopLeft(1030, 124, 1910, 185, canvasHeight: size.height)
let stickyActionRect = rectFromTopLeft(2470, 1020, 470, 410, canvasHeight: size.height)
let drawerRect = rectFromTopLeft(980, 1115, 1500, 420, canvasHeight: size.height)
let outputSectionRect = rectFromTopLeft(1030, 468, 660, 230, canvasHeight: size.height)

drawRoundedRect(workItemRect, fill: blue.withAlphaComponent(0.08), stroke: blue)
drawRoundedRect(stickyActionRect, fill: orange.withAlphaComponent(0.08), stroke: orange)
drawRoundedRect(drawerRect, fill: green.withAlphaComponent(0.08), stroke: green)
drawRoundedRect(outputSectionRect, fill: purple.withAlphaComponent(0.10), stroke: purple)

let callouts = [
    Callout(
        title: "Fixed Work Item Context",
        body: "Keep the work item header stable so the objective stays visible while the user moves between thread, output, and sources.",
        anchor: NSPoint(x: workItemRect.midX, y: workItemRect.maxY - 10),
        box: rectFromTopLeft(1840, 86, 960, 170, canvasHeight: size.height),
        color: blue
    ),
    Callout(
        title: "Anchor Critical Actions",
        body: "Approval, export, and escalation controls should remain visible without requiring the user to scroll through thread history.",
        anchor: NSPoint(x: stickyActionRect.minX + 18, y: stickyActionRect.midY),
        box: rectFromTopLeft(1910, 1620, 1020, 185, canvasHeight: size.height),
        color: orange
    ),
    Callout(
        title: "Collapsible Execution Drawer",
        body: "Agent activity and run history are operational context. Let this drawer expand during execution and collapse when the workspace goes idle.",
        anchor: NSPoint(x: drawerRect.midX, y: drawerRect.maxY - 8),
        box: rectFromTopLeft(520, 1605, 1190, 190, canvasHeight: size.height),
        color: green
    ),
    Callout(
        title: "Thread To Output Feedback",
        body: "When a thread instruction changes a section, show loading or highlight states directly in the output so the user can see what is being updated.",
        anchor: NSPoint(x: outputSectionRect.midX, y: outputSectionRect.midY),
        box: rectFromTopLeft(500, 710, 1080, 185, canvasHeight: size.height),
        color: purple
    )
]

for callout in callouts {
    drawCallout(callout, canvasHeight: size.height)
}

let titleAttrs: [NSAttributedString.Key: Any] = [
    .font: NSFont(name: "Arial Bold", size: 28) ?? NSFont.boldSystemFont(ofSize: 28),
    .foregroundColor: NSColor(calibratedWhite: 0.12, alpha: 1.0)
]
let subtitleAttrs: [NSAttributedString.Key: Any] = [
    .font: NSFont(name: "Arial", size: 15) ?? NSFont.systemFont(ofSize: 15),
    .foregroundColor: NSColor(calibratedWhite: 0.35, alpha: 1.0)
]

"UI Feedback Refinements".draw(at: NSPoint(x: 470, y: size.height - 58), withAttributes: titleAttrs)
"Illustrative interaction guidance layered onto the partner workspace shell.".draw(at: NSPoint(x: 470, y: size.height - 86), withAttributes: subtitleAttrs)

outputImage.unlockFocus()

guard
    let tiffData = outputImage.tiffRepresentation,
    let rep = NSBitmapImageRep(data: tiffData),
    let pngData = rep.representation(using: .png, properties: [:])
else {
    fputs("failed to encode output image\n", stderr)
    exit(1)
}

do {
    try pngData.write(to: URL(fileURLWithPath: outputPath))
} catch {
    fputs("failed to write output image: \(error)\n", stderr)
    exit(1)
}
