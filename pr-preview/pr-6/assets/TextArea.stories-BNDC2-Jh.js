import{j as e}from"./jsx-runtime-u17CrQMm.js";import{T as t}from"./TextArea-CRq6Ceee.js";import{H as p,T as r}from"./Typography-Cmc6Gt2e.js";import"./iframe-D13rUlhB.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BmGQd4RS.js";import"./bundle-mjs-Ce1ZTWB2.js";import"./Input-2R42-Ccl.js";import"./useControlled-D18dhzFV.js";import"./floating-ui.utils.dom-wHRPQCF9.js";import"./useRenderElement-CbcSstyx.js";import"./owner-CvMgaIeV.js";import"./LabelableContext-DU2AqePP.js";import"./index-Bc5eE9t5.js";import"./index-0nySZKvk.js";import"./useLabelableId-B5RE_ULw.js";import"./useBaseUiId-C-sj7-By.js";import"./element-D2Kx1mQN.js";import"./detectBrowser-B_JuCNHz.js";import"./constants-CRqqCNE_.js";const A={title:"UI/TextArea",component:t,tags:["autodocs"],argTypes:{}},a={args:{placeholder:"Type your message here..."}},s={render:()=>e.jsxs("div",{className:"pb:flex pb:flex-col pb:gap-12 pb:p-4 pb:max-w-lg",children:[e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(p,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase",children:"Styles & Sizes"}),e.jsxs("div",{className:"pb:space-y-6",children:[e.jsxs("div",{className:"pb:space-y-1",children:[e.jsx(r,{variant:"small",className:"pb:font-bold",children:"With Predefined Value"}),e.jsx(t,{defaultValue:"This is some predefined text in the textarea."})]}),e.jsxs("div",{className:"pb:space-y-1",children:[e.jsx(r,{variant:"small",className:"pb:font-bold",children:"Large (10 rows)"}),e.jsx(t,{rows:10,placeholder:"A larger textarea for more content..."})]})]})]}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(p,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase",children:"States"}),e.jsxs("div",{className:"pb:space-y-1",children:[e.jsx(r,{variant:"small",className:"pb:font-bold",children:"Disabled"}),e.jsx(t,{disabled:!0,placeholder:"Cannot type here",defaultValue:"Read only content"})]})]})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Type your message here..."
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div className="pb:flex pb:flex-col pb:gap-12 pb:p-4 pb:max-w-lg">
      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Styles & Sizes
        </Heading>
        <div className="pb:space-y-6">
          <div className="pb:space-y-1">
            <Text variant="small" className="pb:font-bold">
              With Predefined Value
            </Text>
            <TextArea defaultValue="This is some predefined text in the textarea." />
          </div>
          <div className="pb:space-y-1">
            <Text variant="small" className="pb:font-bold">
              Large (10 rows)
            </Text>
            <TextArea rows={10} placeholder="A larger textarea for more content..." />
          </div>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          States
        </Heading>
        <div className="pb:space-y-1">
          <Text variant="small" className="pb:font-bold">
            Disabled
          </Text>
          <TextArea disabled placeholder="Cannot type here" defaultValue="Read only content" />
        </div>
      </div>
    </div>
}`,...s.parameters?.docs?.source}}};const w=["Default","Variations"];export{a as Default,s as Variations,w as __namedExportsOrder,A as default};
