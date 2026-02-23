class TextExtraction {
  
  constructor(text, patterns) {
    this.text = text;
    this.patterns = patterns || [];
  }

  
  parse() {
    let parsedTexts = [{ children: this.text }];
    this.patterns.forEach((pattern) => {
      let newParts = [];

      parsedTexts.forEach((parsedText) => {
        if (parsedText._matched) {
          newParts.push(parsedText);

          return;
        }

        let parts = [];
        let textLeft = parsedText.children;

        while (textLeft) {
          let matches = pattern.pattern.exec(textLeft);

          if (!matches) {
            break;
          }

          let previousText = textLeft.substr(0, matches.index);

          parts.push({ children: previousText });

          parts.push(this.getMatchedPart(pattern, matches[0], matches));

          textLeft = textLeft.substr(matches.index + matches[0].length);
        }

        parts.push({ children: textLeft });

        newParts.push(...parts);
      });

      parsedTexts = newParts;
    });

    parsedTexts.forEach((parsedText) => delete parsedText._matched);

    return parsedTexts.filter((t) => !!t.children);
  }


  getMatchedPart(matchedPattern, text, matches) {
    let props = {};

    Object.keys(matchedPattern).forEach((key) => {
      if (key === 'pattern' || key === 'renderText') {
        return;
      }

      if (typeof matchedPattern[key] === 'function') {
        props[key] = () => matchedPattern[key](text);
      } else {
        props[key] = matchedPattern[key];
      }
    });

    let children = text;
    if (matchedPattern.renderText && typeof matchedPattern.renderText === 'function') {
      children = matchedPattern.renderText(text, matches);
    }

    return {
      ...props,
      children: children,
      _matched: true
    };
  }
}

export default TextExtraction;
