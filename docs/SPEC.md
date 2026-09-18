# SonicLight — Concept Spec

Working spec derived from the exercise brief (`project-overview.md`) plus decisions made to
resolve the points the brief deliberately leaves open. Each decision below is a deliberate
choice, not a default — see "Known limitations" for the one traded off intentionally.

## Identity

- Username-only, no password.
- Username is the sole key to retrieve a user's drawings.
- One hardcoded admin user (username: admin).

**Known limitation (by design):** username acts as a bearer credential — anyone who knows a
username can view/claim that user's drawings from any device. Accepted tradeoff given the
exercise scope; not intended as production-grade auth.

## Drawing model

Canvas drawings are **compositions of discrete shapes**, not freehand strokes. A "dessin" is a
scene the user builds by placing and sizing shapes.

- Three shape tools, each bound to a sample family:
    - Circle → `pad`
    - Rectangle → `voice`
    - Triangle → `texture`
- A fixed palette of 5 colors, each color = one sample variation within a family
  (e.g. `padA`…`padE`, `voiceA`…`voiceE`, `textureA`…`textureE`). 15 samples total.
- Interaction: click to drop a shape at fixed default size, then resize it. Clicking a shape
  brings it to the top of the z-order. No freehand drawing.
- Shape size (area) maps to reverb size; color maps to sample variation. Position maps to spatial
  audio (see below).

## Coordinate system

- Canvas uses a fixed logical coordinate space (e.g. 1000×1000 units), independent of physical
  pixel size or device.
- All shape geometry is stored in logical units, never raw pixels.
- The `<canvas>` element scales responsively to fit any screen while preserving the logical
  space, so a drawing renders identically (proportionally) on any device.

## Persistence

Only geometry is stored — no timestamps, no stroke replay data (dropped once playback was
decided to be simultaneous rather than sequenced).

Per shape record: `tool` (circle/rectangle/triangle), `color` (1 of 5), and geometry
(position + size, in logical units) sufficient to compute area and center-offset from canvas
center.

A drawing = a user-owned collection of shape records.

## Audio engine (Web Audio API)

- Sample-based, one audio voice per shape.
- Playback is **simultaneous**: all shapes in a drawing sound together as an ambient/drone
  loop (each sample plays in loop mode), not sequenced by draw order.
- Per-voice parameters derived from the shape:
    - **Angle from canvas center** → stereo pan (`StereoPannerNode`).
    - **Distance from canvas center** → volume / send level (further = quieter or more wet).
    - **Color** → sample variation.
    - **Area** → reverb size/decay parameter.
- **Polyphony cap: 16 simultaneous voices.** Beyond the cap, either the oldest/lowest-priority
  voices are dropped or master gain scales down with voice count (exact rule TBD at
  implementation time).

## Admin

- Read-only gallery of all users' drawings.
- Sees drawing metadata (owner, shape count, etc.) and can trigger the same audio playback
  experience as the owning user.
- No moderation/edit/delete actions in scope.

## Explicitly out of scope (v1)

- Freehand drawing tools.
- Password-based or third-party auth.
- Sequenced/timeline playback (only simultaneous drone mode).

## Priority order

1. Username identity (create/recognize user).
2. Canvas with the three shape tools, palette, resize, z-order.
3. Save drawing (geometry only, logical coordinates).
4. Retrieve own drawing(s).
5. Admin read-only gallery across all users.
6. Web Audio playback: sample triggering, pan/volume from position, reverb type/size from
   color/area, polyphony cap.
