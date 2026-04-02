import{j as e}from"./jsx-runtime-u17CrQMm.js";import{C as c}from"./Checkbox-BD5OBAah.js";import{H as d}from"./Typography-Cmc6Gt2e.js";import{R as i}from"./iframe-D13rUlhB.js";import"./utils-BmGQd4RS.js";import"./bundle-mjs-Ce1ZTWB2.js";import"./Icon-DBJlkqnP.js";import"./useRenderElement-CbcSstyx.js";import"./useControlled-D18dhzFV.js";import"./floating-ui.utils.dom-wHRPQCF9.js";import"./visuallyHidden-COI6QeQH.js";import"./LabelableContext-DU2AqePP.js";import"./index-Bc5eE9t5.js";import"./index-0nySZKvk.js";import"./useBaseUiId-C-sj7-By.js";import"./useButton-D9tzRV-Q.js";import"./useAriaLabelledBy-CMAIAX4y.js";import"./useValueChanged-Dd-7RhkP.js";import"./useOpenChangeComplete-BCUGvzLt.js";import"./useAnimationFrame-Cn-dUaus.js";import"./useOnMount-CaSRcZyW.js";import"./preload-helper-PPVm8Dsz.js";const w={title:"UI/Checkbox",component:c,tags:["autodocs"]},a=r=>{const[l,p]=i.useState(r.checked||!1);return e.jsxs("div",{className:"pb:flex pb:items-center pb:space-x-2",children:[e.jsx(c,{...r,id:"terms",checked:l,onChange:o=>p(o.target.checked)}),e.jsx("label",{htmlFor:"terms",className:"pb:text-sm pb:font-medium pb:leading-none peer-disabled:pb:cursor-not-allowed peer-disabled:pb:opacity-70",children:r.label||"Accept terms and conditions"})]})},t={render:()=>e.jsx(a,{})},s={render:()=>e.jsx("div",{className:"pb:flex pb:flex-col pb:gap-8 pb:p-4",children:e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(d,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase",children:"States"}),e.jsxs("div",{className:"pb:flex pb:flex-col pb:gap-4",children:[e.jsx(a,{label:"Default Unchecked"}),e.jsx(a,{label:"Default Checked",checked:!0}),e.jsx(a,{label:"Disabled Unchecked",disabled:!0}),e.jsx(a,{label:"Disabled Checked",disabled:!0,checked:!0})]})]})})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <StatefulCheckbox />
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div className="pb:flex pb:flex-col pb:gap-8 pb:p-4">
      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          States
        </Heading>
        <div className="pb:flex pb:flex-col pb:gap-4">
          <StatefulCheckbox label="Default Unchecked" />
          <StatefulCheckbox label="Default Checked" checked={true} />
          <StatefulCheckbox label="Disabled Unchecked" disabled={true} />
          <StatefulCheckbox label="Disabled Checked" disabled={true} checked={true} />
        </div>
      </div>
    </div>
}`,...s.parameters?.docs?.source}}};const A=["Default","Variations"];export{t as Default,s as Variations,A as __namedExportsOrder,w as default};
