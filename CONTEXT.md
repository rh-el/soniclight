# SonicLight

A tool where users compose a drawing out of coloured shapes, and each shape plays a sound.

## Language

**Drawing**:
A user's named collection of shapes, owned by one user.
_Avoid_: project, canvas (the canvas is where a drawing is edited, not the drawing itself)

**Canvas**:
The fixed square space in which a drawing is edited. Positions and sizes are expressed in its own units, not screen pixels.
_Avoid_: board, stage

**Shape**:
One discrete element placed on the canvas, having a type, a colour, a position and a size.
_Avoid_: object, element, area

**Shape type**:
Circle, rectangle or triangle. Each type belongs to one sound family: circle → pad, rectangle → voice, triangle → texture.
_Avoid_: tool (the toolbox button that creates a type is a tool, the type is not)

**Colour**:
One of five named colours. Choosing a colour selects a sound variation.

**Sample**:
The combination of a shape type and a colour. There are 15. A sample can appear at most once in a drawing.
_Avoid_: combo, variant

**Shape name**:
The `type_colour` label of a shape (e.g. `triangle_red`). Unique within a drawing because a sample is unique.

**Placing**:
Choosing a type and a colour, then dropping the resulting shape onto the canvas. A shape being placed is a **pending shape**.

**Selection**:
The one shape currently being edited (resized or deleted). Made by clicking it on the canvas or in the shape list.

**Rotation**:
The angle of a rectangle or triangle around its own center. Circles have none. It does not change a shape's size or position.

**Stacking**:
Which shape appears in front of which. Selecting a shape, or placing a new one, brings it to the front. It is independent of the order in the shape list, which follows creation.

**Shape list**:
The left-panel list of a drawing's shapes by name, in creation order, used to select a shape.
_Avoid_: area list

## Editor modes

- **Base**: nothing selected or pending.
- **Shape-selected**: a type button was clicked and its colour choices are open.
- **Color-selected**: a colour was chosen; the pending shape follows the cursor.
- **Shape-update**: an existing shape is selected and can be resized or deleted.
