import React from 'react';
import PropTypes from 'prop-types';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';

class CodeBlock extends React.Component {
  
	render() {
	
		if (!this.props.value) {
		return (<pre><code></code></pre>);
		}

		if (this.props.value.length < 100000) {
			const highlightedCode = hljs.highlightAuto(this.props.value).value;
			return (
			<pre>
				<code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
			</pre>
			);
		} else {
			return (
			<pre>
				<code>{this.props.value}</code>
			</pre>
			);
		}
	}
  
}
CodeBlock.propTypes = {
  value: PropTypes.string.isRequired,
};

export default CodeBlock;