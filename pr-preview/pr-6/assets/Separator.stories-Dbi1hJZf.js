import{j as e}from"./jsx-runtime-u17CrQMm.js";import{S as t}from"./Separator-mvHYTzdr.js";import{T as a,H as n}from"./Typography-Cmc6Gt2e.js";import"./iframe-D13rUlhB.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BmGQd4RS.js";import"./bundle-mjs-Ce1ZTWB2.js";import"./useRenderElement-CbcSstyx.js";const v={title:"UI/Separator",component:t,tags:["autodocs"],argTypes:{orientation:{control:"radio",options:["horizontal","vertical"]}}},s={args:{orientation:"horizontal"},render:i=>e.jsxs("div",{className:"pb:w-64",children:[e.jsx(a,{children:"Above the separator"}),e.jsx(t,{...i,className:"pb:my-4"}),e.jsx(a,{children:"Below the separator"})]})},r={render:()=>e.jsxs("div",{className:"pb:flex pb:flex-col pb:gap-12 pb:p-4",children:[e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(n,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase",children:"Horizontal (Default)"}),e.jsxs("div",{className:"pb:w-64",children:[e.jsx(a,{variant:"small",children:"Item A"}),e.jsx(t,{className:"pb:my-2"}),e.jsx(a,{variant:"small",children:"Item B"})]})]}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(n,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase",children:"Vertical"}),e.jsxs("div",{className:"pb:flex pb:h-8 pb:items-center pb:gap-4 pb:text-sm",children:[e.jsx(a,{variant:"small",children:"Option 1"}),e.jsx(t,{orientation:"vertical"}),e.jsx(a,{variant:"small",children:"Option 2"}),e.jsx(t,{orientation:"vertical"}),e.jsx(a,{variant:"small",children:"Option 3"})]})]})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    orientation: "horizontal"
  },
  render: args => <div className="pb:w-64">
      <Text>Above the separator</Text>
      <Separator {...args} className="pb:my-4" />
      <Text>Below the separator</Text>
    </div>
}`,...s.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <div className="pb:flex pb:flex-col pb:gap-12 pb:p-4">
      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Horizontal (Default)
        </Heading>
        <div className="pb:w-64">
          <Text variant="small">Item A</Text>
          <Separator className="pb:my-2" />
          <Text variant="small">Item B</Text>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Vertical
        </Heading>
        <div className="pb:flex pb:h-8 pb:items-center pb:gap-4 pb:text-sm">
          <Text variant="small">Option 1</Text>
          <Separator orientation="vertical" />
          <Text variant="small">Option 2</Text>
          <Separator orientation="vertical" />
          <Text variant="small">Option 3</Text>
        </div>
      </div>
    </div>
}`,...r.parameters?.docs?.source}}};const h=["Default","Variations"];export{s as Default,r as Variations,h as __namedExportsOrder,v as default};
