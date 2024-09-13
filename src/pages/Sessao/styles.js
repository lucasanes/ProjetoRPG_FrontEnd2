import { keyframes, styled } from "../../stitches.config";

export const Container = styled("div", {
  width: "100%",
  height: "calc(100% - 72px)",
  background: "rgb(20,20,20)",
  display: 'flex',
  flexDirection: 'column'
});

export const Body = styled("div", {
  overflowY: "auto",
  width: '100%',
  height: '100%',
  padding: "3rem 2rem 1rem 2rem",

  hr: {
    borderColor: "$white75",
  },
});

export const DoubleParteContainer = styled("div", {
  display: "flex",
  flexDirection: 'row',
  gridColumnGap: "2rem",
  width: '100%',

  "@lg": {
    flexDirection: "column",
  },
});

export const ParteImgModal = styled('div', {
  height: '95vh',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  overflow: 'hidden',

  img: {
    objectFit: 'contain'
  }
})

const scaleUpImgModal = keyframes({
  '0%': {
    width: '20%',
    opacity: 0
  },

  '100%': {
    width: '100%',
    opacity: 1
  },
});

export const ImgModal = styled('img', {

  animation: `${scaleUpImgModal} 300ms`,
  width: '100%'

})