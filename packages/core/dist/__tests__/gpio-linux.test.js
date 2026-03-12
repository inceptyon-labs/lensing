import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createGpiomonFactory } from '../gpio-linux';
import * as childProcess from 'node:child_process';
vi.mock('node:child_process');
const mockExecFileSync = vi.fn();
const mockSpawn = vi.fn();
vi.mocked(childProcess.execFileSync).mockImplementation(mockExecFileSync);
vi.mocked(childProcess.spawn).mockImplementation(mockSpawn);
describe('createGpiomonFactory', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('gpiomon version detection', () => {
        it('should use execFileSync instead of execSync for version check', () => {
            // Setup v2 version output
            mockExecFileSync.mockReturnValue('gpiomon (libgpiod) v2.1.0\n');
            createGpiomonFactory();
            // Should have called execFileSync, not execSync
            expect(mockExecFileSync).toHaveBeenCalledWith('gpiomon', ['--version'], expect.any(Object));
        });
        it('should detect gpiomon v2 correctly', () => {
            mockExecFileSync.mockReturnValue('gpiomon (libgpiod) v2.1.0\n');
            const factory = createGpiomonFactory();
            const watcher = factory(17);
            // Mock spawn for watch call
            mockSpawn.mockReturnValue({
                stdout: null,
                stderr: null,
                on: vi.fn(),
                kill: vi.fn(),
            });
            watcher.watch(() => { });
            // Should use v2 syntax: -c gpiochip0 17
            expect(mockSpawn).toHaveBeenCalledWith('gpiomon', ['-c', 'gpiochip0', '17'], expect.any(Object));
        });
        it('should detect gpiomon v1 correctly', () => {
            mockExecFileSync.mockReturnValue('gpiomon (libgpiod) v1.6.0\n');
            const factory = createGpiomonFactory();
            const watcher = factory(17);
            // Mock spawn for watch call
            mockSpawn.mockReturnValue({
                stdout: null,
                stderr: null,
                on: vi.fn(),
                kill: vi.fn(),
            });
            watcher.watch(() => { });
            // Should use v1 syntax: --falling-edge --rising-edge gpiochip0 17
            expect(mockSpawn).toHaveBeenCalledWith('gpiomon', ['--falling-edge', '--rising-edge', 'gpiochip0', '17'], expect.any(Object));
        });
        it('should handle execFileSync failure gracefully', () => {
            mockExecFileSync.mockImplementation(() => {
                throw new Error('gpiomon not found');
            });
            // Should not throw — defaults to v1
            const factory = createGpiomonFactory();
            expect(factory).toBeDefined();
        });
    });
    describe('spawn usage', () => {
        it('should use spawn for gpiomon watch (not exec variants)', () => {
            mockExecFileSync.mockReturnValue('gpiomon (libgpiod) v1.6.0\n');
            const factory = createGpiomonFactory();
            const watcher = factory(17);
            mockSpawn.mockReturnValue({
                stdout: null,
                stderr: null,
                on: vi.fn(),
                kill: vi.fn(),
            });
            watcher.watch(() => { });
            // Should use spawn, not exec/execSync/execFile
            expect(mockSpawn).toHaveBeenCalledWith('gpiomon', expect.any(Array), expect.any(Object));
            expect(mockExecFileSync).toHaveBeenCalledTimes(1); // Only for version check
        });
        it('should use custom chip parameter', () => {
            mockExecFileSync.mockReturnValue('gpiomon (libgpiod) v2.0.0\n');
            const factory = createGpiomonFactory('gpiochip1');
            const watcher = factory(23);
            mockSpawn.mockReturnValue({
                stdout: null,
                stderr: null,
                on: vi.fn(),
                kill: vi.fn(),
            });
            watcher.watch(() => { });
            expect(mockSpawn).toHaveBeenCalledWith('gpiomon', ['-c', 'gpiochip1', '23'], expect.any(Object));
        });
    });
});
//# sourceMappingURL=gpio-linux.test.js.map