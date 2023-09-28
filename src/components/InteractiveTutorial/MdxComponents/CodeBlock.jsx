import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Highlight, Prism, themes } from 'prism-react-renderer';
import { alpha, Box, Button } from '@mui/material';
import { requestFromCode } from '../../CodeEditorWindow/config/RequesFromCode';
import { useTutorial } from '../../../context/tutorial-context';
import { useTheme } from '@mui/material/styles';
import { PlayArrowOutlined } from '@mui/icons-material';
import { CopyButton } from '../../Common/CopyButton';
import { DARK_BACKGROUND, LIGHT_BACKGROUND } from './MdxComponents';

/**
 * Run button for code block
 * @param {string} code
 * @return {JSX.Element}
 * @constructor
 */
export const RunButton = ({ code }) => {
  const { setResult } = useTutorial();
  const handleClick = () => {
    requestFromCode(code, false).then((res) => {
      if (res && res.status === 'ok') {
        setResult(() => JSON.stringify(res));
      } else {
        setResult(() => JSON.stringify(res));
      }
    });
  };
  return (
    <Button variant="outlined" endIcon={<PlayArrowOutlined />} onClick={handleClick} data-testid="code-block-run">
      Run
    </Button>
  );
};

RunButton.propTypes = {
  code: PropTypes.string.isRequired,
};

/**
 * Code block with syntax highlighting
 * @param {object} children - code block content from mdx
 * @return {JSX.Element}
 * @constructor
 */
export const CodeBlock = ({ children }) => {
  const className = children.props.className || '';
  const code = children.props.children.trim();
  const language = className.replace(/language-/, '');
  const withRunButton = children.props.withRunButton && JSON.parse(children.props.withRunButton);
  const theme = useTheme();
  const prismTheme = theme.palette.mode === 'light' ? themes.nightOwlLight : themes.vsDark;
  const backgroundColor = theme.palette.mode === 'light' ? LIGHT_BACKGROUND : DARK_BACKGROUND;

  useEffect(() => {
    // we need this to use prismjs support for json highlighting
    // which is not included in the prism-react-renderer package by default
    window.Prism = Prism; // (or check for window is undefined for ssr and use global)
    (async () => await import('prismjs/components/prism-json'))();
  }, []);

  return (
    <Box
      sx={{
        background: backgroundColor,
        borderRadius: '0.5rem',
        my: 3,
      }}
      data-testid={'code-block'}
    >
      <Box
        display={'flex'}
        alignItems={'center'}
        px={2}
        py={1}
        sx={{
          background: alpha(theme.palette.primary.main, 0.05),
        }}
      >
        {withRunButton && (
          <Box sx={{ flexGrow: '1' }}>
            <RunButton code={code} />
          </Box>
        )}
        <Box sx={{ flexGrow: '1' }} />
        <CopyButton text={code} />
      </Box>
      <Box sx={{ px: 2, pb: 1 }}>
        <Highlight code={code} language={language} theme={prismTheme} prism={Prism}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => {
            return (
              <pre
                className={className}
                style={{
                  overflowX: 'auto',
                  ...style,
                }}
                data-testid={'code-block-pre'}
              >
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line, key: i })}>
                    {line.map((token, key) => (
                      <span key={token} {...getTokenProps({ token, key })} />
                    ))}
                  </div>
                ))}
              </pre>
            );
          }}
        </Highlight>
      </Box>
    </Box>
  );
};

CodeBlock.propTypes = {
  children: PropTypes.shape({
    props: PropTypes.shape({
      className: PropTypes.string,
      children: PropTypes.string.isRequired,
      withRunButton: PropTypes.string,
    }),
  }),
};
