import { StylesConfig } from "react-select";

const reactSelectTheme: StylesConfig = {
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: "#f5f5f5",
    width: "100%",
    transition: "all 0.2s ease-in-out",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    color: "#364153",
    borderRadius: "8px",
    borderWidth: "2px",
    borderColor: isFocused ? "#4d82b8" : "oklch(0.929 0.013 255.508)",
    ":hover": {
      borderColor: isFocused ? "#4d82b8" : "oklch(0.929 0.013 255.508)",
    },
  }),
  option: (styles, { isDisabled, isFocused, isSelected }) =>
    ({
      ...styles,
      color: "#364153",
      cursor: isDisabled ? "not-allowed" : "default",
      whiteSpace: "pre-line !important",
      backgroundColor: isDisabled
        ? null
        : isSelected
          ? "#f5f5f5"
          : isFocused
            ? "#f5f5f5"
            : null,
      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled && (isSelected ? "#f5f5f5" : "#f5f5f5"),
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any,
  placeholder: (styles) => ({
    ...styles,
    color: "gray",
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
  }),
};

export default reactSelectTheme;
