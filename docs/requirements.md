# SonicLight Requirements

This document is a concise implementation guide derived from the concept specification.

## 1. Identity

- Users identify themselves with a username only.
- No password or third-party authentication is required for v1.
- The username is the key used to retrieve a user's drawings across devices.
- Username acts as a bearer credential. This is an accepted exercise-scope tradeoff, not production-grade authentication.
- There is one seeded admin user, with username "admin".

## 2. Drawing

A drawing is a composition of discrete shapes rather than freehand strokes.

Supported shape types:

- Circle → pad
- Rectangle → voice
- Triangle → texture

There are 3 shape families with a fixed palette of 5 colors per family, for 15 samples total.

Interactions:

- Clicking the canvas drops a shape at the clicked position.
- Shapes use a fixed default size when created.
- Shapes can be resized.
- Clicking a shape brings it to the top z-order.

## 3. Canvas

- Use a fixed logical coordinate space, e.g. `1000 × 1000`.
- Logical coordinates must be independent of the physical canvas size and device.
- Store geometry in logical units.
- A responsive canvas should preserve the same logical drawing space.

## 4. Persistence

Persist drawing geometry only; do not implement timestamped stroke replay.

A shape record needs enough information to represent:

- tool / shape type
- color
- position
- size

Position and size must be sufficient to calculate:

- shape area
- shape center offset from the canvas center

A drawing is a user's collection of shape records.

## 5. Audio

Use the Web Audio API.

- Each shape produces one audio voice.
- Voices play as a simultaneous ambient/drone loop, not as a sequenced timeline.
- Shape angle relative to canvas center maps to stereo pan.
- Shape distance from canvas center maps to volume and/or send.
- Shape color selects the sample variation.
- Shape area maps to reverb.

There is a maximum of 16 simultaneous voices.

If the limit is exceeded, the implementation may either:

- drop the oldest / lowest-priority voice, or
- scale down master gain.

The exact voice-cap behavior is an implementation decision.

## 6. Admin

The seeded admin can view a read-only gallery of all users' drawings.

The gallery should expose metadata such as:

- owner
- shape count

The admin can trigger the same audio playback.

## 7. Out of scope for v1

Do not add:

- freehand drawing
- password authentication
- third-party authentication
- sequenced / timeline playback

## 8. Priority

Implement in roughly this order:

1. Username identity
2. Canvas tools, palette, resize, and z-order
3. Save drawing
4. Admin gallery
5. Web Audio
