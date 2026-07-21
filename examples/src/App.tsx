import { Container, Divider, Typography } from "@mui/material";
import { ExampleSection } from "./ExampleSection";
import { BasicFormExample } from "./examples/BasicFormExample";
import { DisabledFeaturesExample } from "./examples/DisabledFeaturesExample";
import { ProgrammaticUpdateExample } from "./examples/ProgrammaticUpdateExample";
import { TranslationsExample } from "./examples/TranslationsExample";
import { ViewerExample } from "./examples/ViewerExample";

import basicFormSource from "./examples/BasicFormExample.tsx?raw";
import disabledFeaturesSource from "./examples/DisabledFeaturesExample.tsx?raw";
import programmaticSource from "./examples/ProgrammaticUpdateExample.tsx?raw";
import translationsSource from "./examples/TranslationsExample.tsx?raw";
import viewerSource from "./examples/ViewerExample.tsx?raw";

export default function App() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        @cronn/mui-rich-text-editor
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Live examples
      </Typography>
      <Divider sx={{ my: 3 }} />

      <ExampleSection
        title="Basic form"
        description="RichTextControl wired to React Hook Form. Submit to see the serialized HTML."
        code={basicFormSource}
      >
        <BasicFormExample />
      </ExampleSection>

      <Divider sx={{ my: 3 }} />

      <ExampleSection
        title="Read-only viewer"
        description="RichTextViewer renders saved HTML with the same styles as the editor."
        code={viewerSource}
      >
        <ViewerExample />
      </ExampleSection>

      <Divider sx={{ my: 3 }} />

      <ExampleSection
        title="Disabled toolbar features"
        description={
          <>
            <code>disableLink</code> and <code>disableImageUpload</code> hide
            those toolbar buttons.
          </>
        }
        code={disabledFeaturesSource}
      >
        <DisabledFeaturesExample />
      </ExampleSection>

      <Divider sx={{ my: 3 }} />

      <ExampleSection
        title="Programmatic content update"
        description={
          <>
            Use the <code>forceSetValue</code> imperative handle to push content
            into the editor from outside the form.
          </>
        }
        code={programmaticSource}
      >
        <ProgrammaticUpdateExample />
      </ExampleSection>

      <Divider sx={{ my: 3 }} />

      <ExampleSection
        title="Custom translations"
        description={
          <>
            Override any toolbar labels with the <code>translations</code> prop
            (English shown below).
          </>
        }
        code={translationsSource}
      >
        <TranslationsExample />
      </ExampleSection>
    </Container>
  );
}
