// Override BigInt prototype to support auto-serialization to JSON string.
// This prevents the "TypeError: Do not know how to serialize a BigInt" error.
(BigInt.prototype as any).toJSON = function (): string {
  return this.toString();
};
