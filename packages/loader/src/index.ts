/**
 * @awp/loader - Filesystem package loader for Agent Platform
 */

export { PackageLoader, detectPackageKind, loadFromMultiplePaths } from './package-loader';
export { PackageRegistry } from './package-registry';
export type {
  LoaderOptions,
  PackageLoadResult,
  DiscoveryResult,
  PackageKind,
  AnyPackage,
  PackageRef,
  ReferenceResolutionResult,
  ValidationOptions,
  ValidationError,
  ValidationResult,
} from './types';
