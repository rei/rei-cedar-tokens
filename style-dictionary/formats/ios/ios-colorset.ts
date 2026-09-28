type P3ColorValue = {
  'color-space': 'display-p3';
  components: {
    red: string;
    green: string;
    blue: string;
    alpha: string;
  };
};

type IosColorsetToken = {
  name: string;
  value?: {
    light?: P3ColorValue;
    dark?: P3ColorValue;
  };
};

export const iosColorsetFormatter = (token: IosColorsetToken): string => {
  if (!token.value || !token.value.light || !token.value.dark) {
    throw new Error(
      `Token ${token.name} is missing light/dark P3 values. ` +
        `Check that ios-color-action resolved the option token correctly.`,
    );
  }

  return JSON.stringify(
    {
      colors: [
        {
          color: token.value.light,
          idiom: 'universal',
        },
        {
          appearances: [{ appearance: 'luminosity', value: 'dark' }],
          color: token.value.dark,
          idiom: 'universal',
        },
      ],
      info: {
        author: 'xcode',
        version: 1,
      },
    },
    null,
    2,
  );
};
