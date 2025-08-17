export const fontFamily = {
  BebasNeue_Regular: "BebasNeue-Regular",
  Inter_Black: "Inter-Black",
  Inter_BlackItalic: "Inter-BlackItalic",
  Inter_Bold: "Inter-Bold",
  Inter_BoldItalic: "Inter-BoldItalic",
  Inter_ExtraBold: "Inter-ExtraBold",
  Inter_ExtraBoldItalic: "Inter-ExtraBoldItalic",
  Inter_ExtraLight: "Inter-ExtraLight",
  Inter_ExtraLightItalic: "Inter-ExtraLightItalic",
  Inter_Italic: "Inter-Italic",
  Inter_Light: "Inter-Light",
  Inter_LightItalic: "Inter-LightItalic",
  Inter_Medium: "Inter-Medium",
  Inter_MediumItalic: "Inter-MediumItalic",

  Inter_Regular: "Inter-Regular",
  Inter_SemiBold: "Inter-SemiBold",
  Inter_SemiBoldItalic: "Inter-SemiBoldItalic",
  Inter_Thin: "Inter-Thin",
  Inter_ThinItalic: "Inter-ThinItalic",

  RethinkSans_Regular: "RethinkSans-Regular",

  RethinkSans_Medium: "RethinkSans-Medium",
  RethinkSans_MediumItalic: "RethinkSans-MediumItalic",

  RethinkSans_SemiBold: "RethinkSans-SemiBold",
  RethinkSans_SemiBoldItalic: "RethinkSans-SemiBoldItalic",

  RethinkSans_Italic: "RethinkSans-Italic",

  RethinkSans_Bold: "RethinkSans-Bold",
  RethinkSans_BoldItalic: "RethinkSans-BoldItalic",

  RethinkSans_ExtraBold: "RethinkSans-ExtraBold",
  RethinkSans_ExtraBoldItalic: "RethinkSans-ExtraBoldItalic",
};

// const h1Font = { fontSize: scale(72), lineHeight: scale(90) };
// const h2Font = { fontSize: scale(60), lineHeight: scale(72) };
// const h3Font = { fontSize: scale(48), lineHeight: scale(60) };
// const h4Font = { fontSize: scale(36), lineHeight: scale(44) };
// const h5Font = { fontSize: scale(30), lineHeight: scale(38) };
// const h6Font = { fontSize: scale(24), lineHeight: scale(32) };
// const sub_headline = { fontSize: scale(20), lineHeight: scale(30) };
// const body_large = { fontSize: scale(18), lineHeight: scale(28) };
// const body_small = { fontSize: scale(16), lineHeight: scale(24) };
// const caption_large = { fontSize: scale(14), lineHeight: scale(20) };
// const caption_small = { fontSize: scale(12), lineHeight: scale(18) };

const h1Font = { fontSize: 72, lineHeight: 90 };
const h2Font = { fontSize: 60, lineHeight: 72 };
const h3Font = { fontSize: 48, lineHeight: 60 };
const h4Font = { fontSize: 36, lineHeight: 44 };
const h5Font = { fontSize: 30, lineHeight: 38 };
const h6Font = { fontSize: 24, lineHeight: 32 };
const sub_headline = { fontSize: 20, lineHeight: 30 };
const body_large = { fontSize: 18, lineHeight: 28 };
const body_small = { fontSize: 16, lineHeight: 24 };
const caption_large = { fontSize: 14, lineHeight: 20 };
const caption_small = { fontSize: 12, lineHeight: 18 };

export const fontStyle = {
  h1: {
    regular: {
      ...h1Font,
      fontFamily: fontFamily.RethinkSans_Regular,
    },
    medium: {
      ...h1Font,
      fontFamily: fontFamily.RethinkSans_Medium,
    },
    medium_italic: {
      ...h1Font,
      fontFamily: fontFamily.RethinkSans_Medium,
    },

    semibold: {
      ...h1Font,
      fontFamily: fontFamily.RethinkSans_SemiBold,
    },
    semibold_italic: {
      ...h1Font,
      fontFamily: fontFamily.RethinkSans_SemiBoldItalic,
    },
    italic: {
      ...h1Font,
      fontFamily: fontFamily.RethinkSans_Italic,
    },
    bold: {
      ...h1Font,
      fontFamily: fontFamily.RethinkSans_Bold,
    },
    bold_italic: {
      ...h1Font,
      fontFamily: fontFamily.RethinkSans_BoldItalic,
    },
    extrabold: {
      ...h1Font,
      fontFamily: fontFamily.RethinkSans_Bold,
    },
    extrabold_italic: {
      ...h1Font,
      fontFamily: fontFamily.RethinkSans_BoldItalic,
    },
  },
  h2: {
    regular: {
      ...h2Font,
      fontFamily: fontFamily.RethinkSans_Regular,
    },
    medium: {
      ...h2Font,
      fontFamily: fontFamily.RethinkSans_Medium,
    },
    medium_italic: {
      ...h2Font,
      fontFamily: fontFamily.RethinkSans_Medium,
    },

    semibold: {
      ...h2Font,
      fontFamily: fontFamily.RethinkSans_SemiBold,
    },
    semibold_italic: {
      ...h2Font,
      fontFamily: fontFamily.RethinkSans_SemiBoldItalic,
    },
    italic: {
      ...h2Font,
      fontFamily: fontFamily.RethinkSans_Italic,
    },
    bold: {
      ...h2Font,
      fontFamily: fontFamily.RethinkSans_Bold,
    },
    bold_italic: {
      ...h2Font,
      fontFamily: fontFamily.RethinkSans_BoldItalic,
    },
    extrabold: {
      ...h2Font,
      fontFamily: fontFamily.RethinkSans_Bold,
    },
    extrabold_italic: {
      ...h2Font,
      fontFamily: fontFamily.RethinkSans_BoldItalic,
    },
  },
  h3: {
    regular: {
      ...h3Font,
      fontFamily: fontFamily.RethinkSans_Regular,
    },
    medium: {
      ...h3Font,
      fontFamily: fontFamily.RethinkSans_Medium,
    },
    medium_italic: {
      ...h3Font,
      fontFamily: fontFamily.RethinkSans_Medium,
    },

    semibold: {
      ...h3Font,
      fontFamily: fontFamily.RethinkSans_SemiBold,
    },
    semibold_italic: {
      ...h3Font,
      fontFamily: fontFamily.RethinkSans_SemiBoldItalic,
    },
    italic: {
      ...h3Font,
      fontFamily: fontFamily.RethinkSans_Italic,
    },
    bold: {
      ...h3Font,
      fontFamily: fontFamily.RethinkSans_Bold,
    },
    bold_italic: {
      ...h3Font,
      fontFamily: fontFamily.RethinkSans_BoldItalic,
    },
    extrabold: {
      ...h3Font,
      fontFamily: fontFamily.RethinkSans_Bold,
    },
    extrabold_italic: {
      ...h3Font,
      fontFamily: fontFamily.RethinkSans_BoldItalic,
    },
  },
  h4: {
    regular: {
      ...h4Font,
      fontFamily: fontFamily.RethinkSans_Regular,
    },
    medium: {
      ...h4Font,
      fontFamily: fontFamily.RethinkSans_Medium,
    },
    medium_italic: {
      ...h4Font,
      fontFamily: fontFamily.RethinkSans_Medium,
    },

    semibold: {
      ...h4Font,
      fontFamily: fontFamily.RethinkSans_SemiBold,
    },
    semibold_italic: {
      ...h4Font,
      fontFamily: fontFamily.RethinkSans_SemiBoldItalic,
    },
    italic: {
      ...h4Font,
      fontFamily: fontFamily.RethinkSans_Italic,
    },
    bold: {
      ...h4Font,
      fontFamily: fontFamily.RethinkSans_Bold,
    },
    bold_italic: {
      ...h4Font,
      fontFamily: fontFamily.RethinkSans_BoldItalic,
    },
    extrabold: {
      ...h4Font,
      fontFamily: fontFamily.RethinkSans_Bold,
    },
    extrabold_italic: {
      ...h4Font,
      fontFamily: fontFamily.RethinkSans_BoldItalic,
    },
  },
  h5: {
    regular: {
      ...h5Font,
      fontFamily: fontFamily.RethinkSans_Regular,
    },
    medium: {
      ...h5Font,
      fontFamily: fontFamily.RethinkSans_Medium,
    },
    medium_italic: {
      ...h5Font,
      fontFamily: fontFamily.RethinkSans_Medium,
    },

    semibold: {
      ...h5Font,
      fontFamily: fontFamily.RethinkSans_SemiBold,
    },
    semibold_italic: {
      ...h5Font,
      fontFamily: fontFamily.RethinkSans_SemiBoldItalic,
    },
    italic: {
      ...h5Font,
      fontFamily: fontFamily.RethinkSans_Italic,
    },
    bold: {
      ...h5Font,
      fontFamily: fontFamily.RethinkSans_Bold,
    },
    bold_italic: {
      ...h5Font,
      fontFamily: fontFamily.RethinkSans_BoldItalic,
    },
    extrabold: {
      ...h5Font,
      fontFamily: fontFamily.RethinkSans_Bold,
    },
    extrabold_italic: {
      ...h5Font,
      fontFamily: fontFamily.RethinkSans_BoldItalic,
    },
  },
  h6: {
    regular: {
      ...h6Font,
      fontFamily: fontFamily.RethinkSans_Regular,
    },
    medium: {
      ...h6Font,
      fontFamily: fontFamily.RethinkSans_Medium,
    },
    medium_italic: {
      ...h6Font,
      fontFamily: fontFamily.RethinkSans_Medium,
    },
    semibold: {
      ...h6Font,
      fontFamily: fontFamily.RethinkSans_SemiBold,
    },
    semibold_italic: {
      ...h6Font,
      fontFamily: fontFamily.RethinkSans_SemiBoldItalic,
    },
    italic: {
      ...h6Font,
      fontFamily: fontFamily.RethinkSans_Italic,
    },
    bold: {
      ...h6Font,
      fontFamily: fontFamily.RethinkSans_Bold,
    },
    bold_italic: {
      ...h6Font,
      fontFamily: fontFamily.RethinkSans_BoldItalic,
    },
    extrabold: {
      ...h6Font,
      fontFamily: fontFamily.RethinkSans_Bold,
    },
    extrabold_italic: {
      ...h6Font,
      fontFamily: fontFamily.RethinkSans_BoldItalic,
    },
  },
  sub_headline: {
    regular: {
      ...sub_headline,
      fontFamily: fontFamily.RethinkSans_Regular,
    },
    medium: {
      ...sub_headline,
      fontFamily: fontFamily.RethinkSans_Medium,
    },
    medium_italic: {
      ...sub_headline,
      fontFamily: fontFamily.RethinkSans_Medium,
    },
    semibold: {
      ...sub_headline,
      fontFamily: fontFamily.RethinkSans_SemiBold,
    },
    semibold_italic: {
      ...sub_headline,
      fontFamily: fontFamily.RethinkSans_SemiBoldItalic,
    },
    italic: {
      ...sub_headline,
      fontFamily: fontFamily.RethinkSans_Italic,
    },
    bold: {
      ...sub_headline,
      fontFamily: fontFamily.RethinkSans_Bold,
    },
    bold_italic: {
      ...sub_headline,
      fontFamily: fontFamily.RethinkSans_BoldItalic,
    },
    extrabold: {
      ...sub_headline,
      fontFamily: fontFamily.RethinkSans_Bold,
    },
    extrabold_italic: {
      ...sub_headline,
      fontFamily: fontFamily.RethinkSans_BoldItalic,
    },
  },
  body_large: {
    regular: {
      ...body_large,
      fontFamily: fontFamily.RethinkSans_Regular,
    },
    medium: {
      ...body_large,
      fontFamily: fontFamily.RethinkSans_Medium,
    },
    medium_italic: {
      ...body_large,
      fontFamily: fontFamily.RethinkSans_Medium,
    },
    semibold: {
      ...body_large,
      fontFamily: fontFamily.RethinkSans_SemiBold,
    },
    semibold_italic: {
      ...body_large,
      fontFamily: fontFamily.RethinkSans_SemiBoldItalic,
    },
    italic: {
      ...body_large,
      fontFamily: fontFamily.RethinkSans_Italic,
    },
    bold: {
      ...body_large,
      fontFamily: fontFamily.RethinkSans_Bold,
    },
    bold_italic: {
      ...body_large,
      fontFamily: fontFamily.RethinkSans_BoldItalic,
    },
    extrabold: {
      ...body_large,
      fontFamily: fontFamily.RethinkSans_Bold,
    },
    extrabold_italic: {
      ...body_large,
      fontFamily: fontFamily.RethinkSans_BoldItalic,
    },
  },
  body_small: {
    regular: {
      ...body_small,
      fontFamily: fontFamily.RethinkSans_Regular,
    },
    medium: {
      ...body_small,
      fontFamily: fontFamily.RethinkSans_Medium,
    },
    medium_italic: {
      ...body_small,
      fontFamily: fontFamily.RethinkSans_Medium,
    },
    semibold: {
      ...body_small,
      fontFamily: fontFamily.RethinkSans_SemiBold,
    },
    semibold_italic: {
      ...body_small,
      fontFamily: fontFamily.RethinkSans_SemiBoldItalic,
    },
    italic: {
      ...body_small,
      fontFamily: fontFamily.RethinkSans_Italic,
    },
    bold: {
      ...body_small,
      fontFamily: fontFamily.RethinkSans_Bold,
    },
    bold_italic: {
      ...body_small,
      fontFamily: fontFamily.RethinkSans_BoldItalic,
    },
    extrabold: {
      ...body_small,
      fontFamily: fontFamily.RethinkSans_Bold,
    },
    extrabold_italic: {
      ...body_small,
      fontFamily: fontFamily.RethinkSans_BoldItalic,
    },
  },
  caption_large: {
    regular: {
      ...caption_large,
      fontFamily: fontFamily.RethinkSans_Regular,
    },
    medium: {
      ...caption_large,
      fontFamily: fontFamily.RethinkSans_Medium,
    },
    medium_italic: {
      ...caption_large,
      fontFamily: fontFamily.RethinkSans_Medium,
    },
    semibold: {
      ...caption_large,
      fontFamily: fontFamily.RethinkSans_SemiBold,
    },
    semibold_italic: {
      ...caption_large,
      fontFamily: fontFamily.RethinkSans_SemiBoldItalic,
    },
    italic: {
      ...caption_large,
      fontFamily: fontFamily.RethinkSans_Italic,
    },
    bold: {
      ...caption_large,
      fontFamily: fontFamily.RethinkSans_Bold,
    },
    bold_italic: {
      ...caption_large,
      fontFamily: fontFamily.RethinkSans_BoldItalic,
    },
    extrabold: {
      ...caption_large,
      fontFamily: fontFamily.RethinkSans_Bold,
    },
    extrabold_italic: {
      ...caption_large,
      fontFamily: fontFamily.RethinkSans_BoldItalic,
    },
  },
  caption_small: {
    regular: {
      ...caption_small,
      fontFamily: fontFamily.RethinkSans_Regular,
    },
    medium: {
      ...caption_small,
      fontFamily: fontFamily.RethinkSans_Medium,
    },
    medium_italic: {
      ...caption_small,
      fontFamily: fontFamily.RethinkSans_Medium,
    },
    semibold: {
      ...caption_small,
      fontFamily: fontFamily.RethinkSans_SemiBold,
    },
    semibold_italic: {
      ...caption_small,
      fontFamily: fontFamily.RethinkSans_SemiBoldItalic,
    },
    italic: {
      ...caption_small,
      fontFamily: fontFamily.RethinkSans_Italic,
    },
    bold: {
      ...caption_small,
      fontFamily: fontFamily.RethinkSans_Bold,
    },
    bold_italic: {
      ...caption_small,
      fontFamily: fontFamily.RethinkSans_BoldItalic,
    },
    extrabold: {
      ...caption_small,
      fontFamily: fontFamily.RethinkSans_Bold,
    },
    extrabold_italic: {
      ...caption_small,
      fontFamily: fontFamily.RethinkSans_BoldItalic,
    },
  },
};
