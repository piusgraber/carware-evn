export const timeOptions = { day: "2-digit", year: "numeric", month: "2-digit", hour: "2-digit", minute: "2-digit"};
export const timOptions = { hour: "2-digit", minute: "2-digit"};
export const options = { day: "2-digit", year: "numeric", month: "2-digit" };


export const dateDisp = dat => {
    if (!dat) return "";
    return (
        new Intl.DateTimeFormat("de-CH", options).format(new Date(dat))
    );
  };


  export const timeDisp = dat => {
    if (!dat) return "";
    return (
        new Intl.DateTimeFormat("de-CH", timeOptions).format(new Date(dat))
    );
  };

  export const timDisp = dat => {
    if (!dat) return "";
    return (
        new Intl.DateTimeFormat("de-CH", timOptions).format(new Date(dat))
    );
  };
