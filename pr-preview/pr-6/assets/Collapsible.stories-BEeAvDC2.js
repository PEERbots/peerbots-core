import{j as e}from"./jsx-runtime-u17CrQMm.js";import{C as a}from"./Collapsible-Xv3vPTNk.js";import{H as n}from"./Typography-Cmc6Gt2e.js";import"./iframe-D13rUlhB.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BmGQd4RS.js";import"./bundle-mjs-Ce1ZTWB2.js";import"./Button-bHTpVbF1.js";import"./useButton-D9tzRV-Q.js";import"./floating-ui.utils.dom-wHRPQCF9.js";import"./useRenderElement-CbcSstyx.js";import"./Icon-DBJlkqnP.js";const y={title:"UI/Collapsible",component:a,tags:["autodocs"]},s={args:{title:"Click to expand",children:e.jsx("div",{className:"pb:p-4 pb:bg-gray-50 pb:rounded-md",children:"This is the collapsible content. It can contain any elements."})}},l={render:()=>e.jsxs("div",{className:"pb:flex pb:flex-col pb:gap-8 pb:p-4",children:[e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(n,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase",children:"States & Styling"}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(a,{title:"Initially Open",defaultOpen:!0,children:e.jsx("div",{className:"pb:p-4 pb:bg-gray-50 pb:rounded-md",children:"This content is visible by default."})}),e.jsx(a,{title:e.jsx("span",{className:"pb:font-bold pb:text-primary",children:"Styled Title"}),className:"pb:border pb:border-gray-200 pb:rounded-lg pb:overflow-hidden",children:e.jsx("div",{className:"pb:p-4",children:"Custom styled wrapper and title."})})]})]}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(n,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase",children:"Variants"}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(a,{title:"Secondary (Default)",variant:"secondary",children:e.jsx("div",{className:"pb:p-4 pb:bg-gray-50 pb:rounded-md",children:"Secondary variant content."})}),e.jsx(a,{title:"Ghost",variant:"ghost",children:e.jsx("div",{className:"pb:p-4 pb:bg-gray-50 pb:rounded-md",children:"Ghost variant content."})}),e.jsx(a,{title:"Primary",variant:"primary",children:e.jsx("div",{className:"pb:p-4 pb:bg-gray-50 pb:rounded-md",children:"Primary variant content."})})]})]}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(n,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase",children:"Sizes"}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(a,{title:"Small",size:"sm",children:e.jsx("div",{className:"pb:p-4 pb:bg-gray-50 pb:rounded-md",children:"Small size content."})}),e.jsx(a,{title:"Medium (Default)",size:"md",children:e.jsx("div",{className:"pb:p-4 pb:bg-gray-50 pb:rounded-md",children:"Medium size content."})}),e.jsx(a,{title:"Large",size:"lg",children:e.jsx("div",{className:"pb:p-4 pb:bg-gray-50 pb:rounded-md",children:"Large size content."})})]})]})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Click to expand",
    children: <div className="pb:p-4 pb:bg-gray-50 pb:rounded-md">
        This is the collapsible content. It can contain any elements.
      </div>
  }
}`,...s.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="pb:flex pb:flex-col pb:gap-8 pb:p-4">
      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          States & Styling
        </Heading>
        <div className="pb:space-y-4">
          <Collapsible title="Initially Open" defaultOpen={true}>
            <div className="pb:p-4 pb:bg-gray-50 pb:rounded-md">
              This content is visible by default.
            </div>
          </Collapsible>
          <Collapsible title={<span className="pb:font-bold pb:text-primary">Styled Title</span>} className="pb:border pb:border-gray-200 pb:rounded-lg pb:overflow-hidden">
            <div className="pb:p-4">Custom styled wrapper and title.</div>
          </Collapsible>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Variants
        </Heading>
        <div className="pb:space-y-4">
          <Collapsible title="Secondary (Default)" variant="secondary">
            <div className="pb:p-4 pb:bg-gray-50 pb:rounded-md">
              Secondary variant content.
            </div>
          </Collapsible>
          <Collapsible title="Ghost" variant="ghost">
            <div className="pb:p-4 pb:bg-gray-50 pb:rounded-md">
              Ghost variant content.
            </div>
          </Collapsible>
          <Collapsible title="Primary" variant="primary">
            <div className="pb:p-4 pb:bg-gray-50 pb:rounded-md">
              Primary variant content.
            </div>
          </Collapsible>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Sizes
        </Heading>
        <div className="pb:space-y-4">
          <Collapsible title="Small" size="sm">
            <div className="pb:p-4 pb:bg-gray-50 pb:rounded-md">Small size content.</div>
          </Collapsible>
          <Collapsible title="Medium (Default)" size="md">
            <div className="pb:p-4 pb:bg-gray-50 pb:rounded-md">
              Medium size content.
            </div>
          </Collapsible>
          <Collapsible title="Large" size="lg">
            <div className="pb:p-4 pb:bg-gray-50 pb:rounded-md">Large size content.</div>
          </Collapsible>
        </div>
      </div>
    </div>
}`,...l.parameters?.docs?.source}}};const x=["Default","Variations"];export{s as Default,l as Variations,x as __namedExportsOrder,y as default};
