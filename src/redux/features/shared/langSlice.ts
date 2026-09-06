import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Language = 'bn' | 'en' | 'hi';

interface LangState {
  value: Language;
}

const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('rajseba_lang') as Language;
    if (saved === 'bn' || saved === 'en' || saved === 'hi') {
      return saved;
    }
  }
  return 'bn'; // Default language is Bangla
};

const initialState: LangState = {
  value: getInitialLanguage(),
};

const langSlice = createSlice({
  name: 'lang',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.value = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('rajseba_lang', action.payload);
      }
    },
    toggleLanguage: (state) => {
      let nextLang: Language = 'bn';
      if (state.value === 'bn') nextLang = 'en';
      else if (state.value === 'en') nextLang = 'hi';
      else nextLang = 'bn';

      state.value = nextLang;
      if (typeof window !== 'undefined') {
        localStorage.setItem('rajseba_lang', nextLang);
      }
    },
  },
});

export const { setLanguage, toggleLanguage } = langSlice.actions;
export default langSlice.reducer;
