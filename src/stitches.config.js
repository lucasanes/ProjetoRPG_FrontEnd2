import { createStitches } from "@stitches/react";

export const { styled, css, keyframes, theme } = createStitches({

  theme: {
    colors: {
      cyan: "#00b4dc",
      cyanHover: "#00b4dc50",
      orange: "#ff6200",
      orangeHover: "#ff620050",
      isCritic: "#03fc52",
      isDisaster: "#ff3737",
    }
  },

  media: {
    sm: "(max-width: 500px)",
    md: "(max-width: 680px)",
    lg: "(max-width: 980px)",
    xlg: "(max-width: 1300px)",
  }
});
