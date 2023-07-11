import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`

/* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
  font-family: 'Roboto Mono', monospace;
  
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
/**** JOSH COMEAU GLOBAL STYLES ****/  
/*1. Use a more-intuitive box-sizing model.*/
*, *::before, *::after {
  box-sizing: border-box;
}

/*2. Remove default margin*/
* {
  margin: 0;
}

/*3. Allow percentage-based heights in the application*/
html, body {
  height: 100%;
}

/*Typographic tweaks!
  4. Add accessible line-height
  5. Improve text rendering*/
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  background-color: rgb(243 239 239);
}

/*6. Improve media defaults*/
img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

/*7. Remove built-in form typography style */
input, button, textarea, select {
  font: inherit;
}

/* 8. Avoid text overflows*/
p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}

/*9. Create a root stacking context*/
#root, #__next {
  isolation: isolate;
}

#root {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 100vw
}

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #eeeeee;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

`;

export default GlobalStyles;
