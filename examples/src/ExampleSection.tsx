import { useState } from "react";
import type { ReactNode } from "react";
import { Box, Collapse, IconButton, Tooltip, Typography } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ExampleSectionProps {
  title: string;
  description: ReactNode;
  code: string;
  children: ReactNode;
}

export function ExampleSection({
  title,
  description,
  code,
  children,
}: ExampleSectionProps) {
  const [showCode, setShowCode] = useState(false);

  function handleCopy() {
    void navigator.clipboard.writeText(code);
  }

  return (
    <Box component="section" sx={{ mb: 6 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography variant="h5">{title}</Typography>
        <Tooltip title={showCode ? "Hide source" : "Show source"}>
          <IconButton
            size="small"
            color={showCode ? "primary" : "default"}
            onClick={() => setShowCode((v) => !v)}
          >
            <CodeIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>
      {children}
      <Collapse in={showCode}>
        <Box sx={{ mt: 2, position: "relative" }}>
          <Tooltip title="Copy">
            <IconButton
              size="small"
              onClick={handleCopy}
              sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <SyntaxHighlighter
            language="tsx"
            style={oneLight}
            customStyle={{
              margin: 0,
              borderRadius: 4,
              fontSize: "0.8rem",
              maxHeight: 480,
            }}
          >
            {code}
          </SyntaxHighlighter>
        </Box>
      </Collapse>
    </Box>
  );
}
