import test from 'node:test';
import assert from 'node:assert/strict';
import { nextScreenshotIndex, swipeDirection } from '../scripts/gallery-navigation.js';

test('gallery navigation wraps at either end and keeps a single image selected', () => {
  assert.equal(nextScreenshotIndex(0, -1, 3), 2);
  assert.equal(nextScreenshotIndex(2, 1, 3), 0);
  assert.equal(nextScreenshotIndex(0, 1, 3), 1);
  assert.equal(nextScreenshotIndex(1, -1, 3), 0);
  assert.equal(nextScreenshotIndex(0, 1, 1), 0);
  assert.equal(nextScreenshotIndex(0, -1, 1), 0);
});

test('swipes navigate horizontally while taps and vertical gestures do not', () => {
  assert.equal(swipeDirection(-90, 10), 1);
  assert.equal(swipeDirection(90, -10), -1);
  assert.equal(swipeDirection(25, 0), 0);
  assert.equal(swipeDirection(60, 100), 0);
  assert.equal(swipeDirection(0, 120), 0);
});
