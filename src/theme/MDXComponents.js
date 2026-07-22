import React from "react";
import MDXComponents from "@theme-original/MDXComponents";
import Terminal from "@site/src/components/Terminal";

export default {
    // Re-use the default mapping
    ...MDXComponents,
    // Map the "<Terminal>" tag to our Terminal component
    // `Terminal` will receive all props that were passed to `<Terminal>` in MDX
    Terminal,
};
