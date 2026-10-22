/**
 * ============================================================================
 * Induktr Studio v2.0 — Affine Vector & Matrix Transform Engine
 * High-Performance Linear Algebra Compositor (Zero-Allocation Loop)
 * ============================================================================
 * 2D Affine Transformation Matrix layout in Float32Array (6 floats per entity):
 * [0] a  : Scale X & Rotation (basis vector i.x)
 * [1] b  : Skew Y  & Rotation (basis vector i.y)
 * [2] c  : Skew X  & Rotation (basis vector j.x)
 * [3] d  : Scale Y & Rotation (basis vector j.y)
 * [4] tx : Translation X
 * [5] ty : Translation Y
 */
export class AffineMatrixEngine {
    buffer;
    maxEntities;
    constructor(maxEntities = 256) {
        this.maxEntities = maxEntities;
        // Flat contiguous memory allocation: 6 floats (24 bytes) per entity
        this.buffer = new Float32Array(maxEntities * 6);
        this.resetAll();
    }
    /**
     * Reset all entities to the 2D Identity Matrix:
     * [1, 0, 0, 1, 0, 0] -> matrix(1, 0, 0, 1, 0, 0)
     */
    resetAll() {
        for (let i = 0; i < this.maxEntities; i++) {
            const o = i * 6;
            this.buffer[o + 0] = 1; // a
            this.buffer[o + 1] = 0; // b
            this.buffer[o + 2] = 0; // c
            this.buffer[o + 3] = 1; // d
            this.buffer[o + 4] = 0; // tx
            this.buffer[o + 5] = 0; // ty
        }
    }
    /**
     * Set affine transformation using basis vector decomposition
     */
    setTransform(id, tx, ty, scaleX, scaleY, radians) {
        if (id < 0 || id >= this.maxEntities)
            return;
        const o = id * 6;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        // Transform basis vectors:
        // i' = scaleX * [cos, sin]
        // j' = scaleY * [-sin, cos]
        this.buffer[o + 0] = cos * scaleX;
        this.buffer[o + 1] = sin * scaleX;
        this.buffer[o + 2] = -sin * scaleY;
        this.buffer[o + 3] = cos * scaleY;
        this.buffer[o + 4] = tx;
        this.buffer[o + 5] = ty;
    }
    /**
     * Multiply 2 matrices: M_target = M_target x M_delta
     * Pure matrix multiplication without heap object allocations
     */
    multiply(id, ma, mb, mc, md, mtx, mty) {
        if (id < 0 || id >= this.maxEntities)
            return;
        const o = id * 6;
        const a = this.buffer[o + 0] ?? 1;
        const b = this.buffer[o + 1] ?? 0;
        const c = this.buffer[o + 2] ?? 0;
        const d = this.buffer[o + 3] ?? 1;
        const tx = this.buffer[o + 4] ?? 0;
        const ty = this.buffer[o + 5] ?? 0;
        // Compute affine composition:
        this.buffer[o + 0] = a * ma + c * mb;
        this.buffer[o + 1] = b * ma + d * mb;
        this.buffer[o + 2] = a * mc + c * md;
        this.buffer[o + 3] = b * mc + d * md;
        this.buffer[o + 4] = a * mtx + c * mty + tx;
        this.buffer[o + 5] = b * mtx + d * mty + ty;
    }
    /**
     * Read raw matrix parameters directly from contiguous buffer
     */
    getMatrix(id) {
        const o = id * 6;
        const a = this.buffer[o + 0] ?? 1;
        const b = this.buffer[o + 1] ?? 0;
        const c = this.buffer[o + 2] ?? 0;
        const d = this.buffer[o + 3] ?? 1;
        const tx = this.buffer[o + 4] ?? 0;
        const ty = this.buffer[o + 5] ?? 0;
        return [a, b, c, d, tx, ty];
    }
    /**
     * Apply calculated matrix directly to HTML element's GPU compositor transform
     * Pure transform — strictly bypasses browser Layout / Reflow pipeline.
     */
    applyToElement(id, element) {
        const o = id * 6;
        const a = this.buffer[o + 0] ?? 1;
        const b = this.buffer[o + 1] ?? 0;
        const c = this.buffer[o + 2] ?? 0;
        const d = this.buffer[o + 3] ?? 1;
        const tx = this.buffer[o + 4] ?? 0;
        const ty = this.buffer[o + 5] ?? 0;
        element.style.transform = `matrix(${a},${b},${c},${d},${tx},${ty})`;
    }
}
// Global Singleton Engine for high performance across UI slices
export const globalMatrixEngine = new AffineMatrixEngine(512);
