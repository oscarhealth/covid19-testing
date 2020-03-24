export class KeyPressSearcher {
  constructor(
    getSearchStringFromOption = (option) => option[1],
    timeoutDurationMilliseconds = 1000
  ) {
    this.searchStr = '';
    this.getSearchStringFromOption = getSearchStringFromOption;
    this.timeout = null;
    this.timeoutDurationMilliseconds = timeoutDurationMilliseconds;
  }

  addChar = (char) => {
    clearTimeout(this.timeout);

    // This supports pressing the same character to toggle through options
    // starting with the same letter.
    if (char !== this.searchStr) {
      this.searchStr += char;
    }

    this.timeout = setTimeout(this.reset, this.timeoutDurationMilliseconds);
  };

  optionMatches = (option) => {
    const searchString = this.getSearchStringFromOption(option);
    const searchStringLower =
      typeof searchString === 'string' ? searchString.toLowerCase() : '';
    const optionMatches = searchStringLower.startsWith(this.searchStr);

    return optionMatches;
  };

  findOptionIndex = (options, currentIndex) => {
    const nextIndex = options.findIndex(
      (option, idx) => idx > currentIndex && this.optionMatches(option)
    );

    if (nextIndex !== -1) {
      return nextIndex;
    }

    return options.findIndex(
      (option, idx) => idx <= currentIndex && this.optionMatches(option)
    );
  };

  addAndFindIndex = (e, options, currentIndex) => {
    this.addChar(e);

    return this.findOptionIndex(options, currentIndex);
  };

  reset = () => {
    this.searchStr = '';
    this.timeout = null;
  };
}
