import { Close } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Slide,
} from "@mui/material";
import React from "react";
type Props = React.PropsWithChildren<{
  id?: string;
  title?: React.ReactNode;
  subheader?: React.ReactNode;
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
}>;
const style: React.CSSProperties = {
  position: "absolute",
  right: 30,
  bottom: 30,
  maxWidth: 400,
  left: 30,
};

/**
 * Material UI Card implementation that slides into the bottom left
 * corner of the map when it renders
 * @param props
 * @augments Card
 */
export default function MapCard(props: Props): JSX.Element {
  const { children, title, subheader, id, onClose } = props;
  return (
    <Slide in direction="right">
      <Card id={id} style={style}>
        <CardHeader
          subheader={subheader}
          title={title}
          action={
            onClose ? (
              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            ) : undefined
          }
        />
        <CardContent>{children}</CardContent>
      </Card>
    </Slide>
  );
}
