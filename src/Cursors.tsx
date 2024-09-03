import { JSXElement, For, mergeProps, createMemo } from "solid-js";
import { Dynamic } from "solid-js/web";
import { InstantSolidRoom } from "./InstantSolid";
import { RoomSchemaShape } from "@instantdb/core";

type Style = {
  [key: string]: string | number;
};

export function Cursors<
  RoomSchema extends RoomSchemaShape,
  RoomType extends keyof RoomSchema,
>({
  as = "div",
  spaceId: _spaceId,
  room,
  className,
  style,
  userCursorColor,
  children,
  renderCursor,
  propagate,
  zIndex,
}: {
  spaceId?: string;
  room: InstantSolidRoom<any, RoomSchema, RoomType>;
  style?: Style;
  userCursorColor?: string;
  as?: any;
  className?: string;
  children?: JSXElement;
  renderCursor?: (props: {
    color: string;
    presence: RoomSchema[RoomType]["presence"];
  }) => JSXElement;
  propagate?: boolean;
  zIndex?: number;
}) {
  const spaceId =
    _spaceId ?? `cursors-space-default--${String(room.type)}-${room.id}`;

  const cursorsPresence = room.createPresence({
    keys: [spaceId],
  });

  const fullPresence = room._core._reactor.getPresence(room.type, room.id);

  function onMouseMove(e: MouseEvent) {
    if (!propagate) {
      e.stopPropagation();
    }

    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    const xPercent = ((x - rect.left) / rect.width) * 100;
    const yPercent = ((y - rect.top) / rect.height) * 100;
    cursorsPresence.publishPresence({
      [spaceId]: {
        x,
        y,
        xPercent,
        yPercent,
        color: userCursorColor,
      },
    } as RoomSchema[RoomType]["presence"]);
  }

  function onMouseOut(e: MouseEvent) {
    cursorsPresence.publishPresence({
      [spaceId]: undefined,
    } as RoomSchema[RoomType]["presence"]);
  }

  const cursorElements = () => {};

  return (
    <Dynamic
      component={as}
      onMouseMove={onMouseMove}
      onMouseOut={onMouseOut}
      class={className}
      style={{ position: "relative", ...style }}
    >
      {children}
      <div
        key={spaceId}
        style={{
          ...absStyles,
          ...inertStyles,
          zIndex: zIndex !== undefined ? zIndex : defaultZ,
        }}
      >
        <For
          each={Object.entries(cursorsPresence.peers)}
          children={([id, presence]) => {
            const cursor = presence[spaceId];
            if (!cursor) return null;

            return (
              <div
                key={id}
                style={{
                  ...absStyles,
                  transform: `translate(${cursor.xPercent}%, ${cursor.yPercent}%)`,
                  transformOrigin: "0 0",
                  transition: "transform 100ms",
                }}
              >
                {renderCursor ? (
                  renderCursor({
                    color: cursor.color,
                    presence: fullPresence.peers[id],
                  })
                ) : (
                  <Cursor color={cursor.color} />
                )}
              </div>
            );
          }}
        />
      </div>
    </Dynamic>
  );
}

function Cursor({ color }: { color: string }) {
  const size = 35;
  const fill = color || "black";

  return (
    <svg
      style={{ height: size, width: size }}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        fill="rgba(0,0,0,.2)"
        transform="matrix(1, 0, 0, 1, -11.999999046325684, -8.406899452209473)"
      >
        <path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
        <path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
      </g>
      <g
        fill="white"
        transform="matrix(1, 0, 0, 1, -11.999999046325684, -8.406899452209473)"
      >
        <path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
        <path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
      </g>
      <g
        fill={fill}
        transform="matrix(1, 0, 0, 1, -11.999999046325684, -8.406899452209473)"
      >
        <path d="m19.751 24.4155-1.844.774-3.1-7.374 1.841-.775z" />
        <path d="m13 10.814v11.188l2.969-2.866.428-.139h4.768z" />
      </g>
    </svg>
  );
}

const absStyles: Style = {
  position: "absolute",
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
};

const inertStyles: Style = {
  overflow: "hidden",
  pointerEvents: "none",
  userSelect: "none",
};

const defaultZ = 99999;
