// Єдиний шрифт для логотипа та заголовків (як «Додати товар»).
// paddingLeft/Right — щоб курсивні літери не «з'їдалися» по краях.
export const DISPLAY_FONT = "PlayfairDisplay_400Regular_Italic";

export const displayText = {
  fontFamily: DISPLAY_FONT,
  paddingLeft: 4,
  paddingRight: 4,
};

// Однаковий заголовок для карток «Додати товар» і «Каталог»
export const sectionTitle = {
  ...displayText,
  fontSize: 18,
  color: "#161616",
  marginBottom: 10,
};