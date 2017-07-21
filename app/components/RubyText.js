import React from "react";
import ReactNative from "react-native";

const PATTERNS = {
  ruby: /<ruby>(.*?)<\/ruby>/,
  rt: /<rt>(.*?)<\/rt>/
};

class RubyText extends React.Component {

  static displayName = "RubyText";

  parse() {
    const parts = [];
    let textLeft = this.props.children;

    while (textLeft) {
      const matches = PATTERNS.ruby.exec(textLeft);
      if (!matches) { break; }

      const previousText = textLeft.substr(0, matches.index);
      if (previousText.length) {
        parts.push([previousText]);
      }

      const matched = matches[1];
      const rt_matches = PATTERNS.rt.exec(matched);
      if (rt_matches) {
        const rb = matched.substr(0, rt_matches.index);
        parts.push([rb, rt_matches[1]]);
      } else {
        parts.push([matches[1]]);
      }

      textLeft = textLeft.substr(matches.index + matches[0].length);
    }

    if (textLeft.length) {
      parts.push([textLeft]);
    }

    return parts;
  }

  renderRubyText() {
    if (typeof this.props.children !== "string") { return this.props.children; }

    return this.parse().map((part, index) => {
      if (part.length === 1) {
        return (<ReactNative.Text
          key={`RubyText-${index}`}
          style={this.props.textStyle}
          children={part[0]}
          {...this.props.childrenProps}
        />);
      } else {
        const rbFontSize = (this.props.textStyle &&
          this.props.textStyle.fontSize) || 14;
        const rtFontSize = rbFontSize * 0.618;
        let letterSpacing = 2;
        if (part[0].length > 1) {
          letterSpacing = Math.max(2, (rtFontSize * part[1].length - rbFontSize * part[0].length) / (part[0].length - 1));
        }

        return (<ReactNative.View
          key={`RubyText-${index}`}
        >
          <ReactNative.Text
            key={`RtText-${index}`}
            style={[this.props.rtStyle || this.props.textStyle, { fontSize: rtFontSize }]}
            children={part[1]}
            {...this.props.childrenProps}
          />
          <ReactNative.Text
            key={`RbText-${index}`}
            style={[this.props.rbStyle || this.props.textStyle, { letterSpacing }]}
            children={part[0]}
            {...this.props.childrenProps}
          />
        </ReactNative.View>);
      }
    });
  }

  render() {
    return (
      <ReactNative.View
        ref={ref => this._root = ref}
        style={[this.props.style, styles.container]}
      >
        {this.renderRubyText()}
      </ReactNative.View>
    );
  }
}

const styles = ReactNative.StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-end",
  },

});

export default RubyText;
