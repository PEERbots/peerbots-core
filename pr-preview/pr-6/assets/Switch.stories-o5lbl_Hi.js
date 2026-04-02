import{j as e}from"./jsx-runtime-u17CrQMm.js";import{S as a}from"./Switch-mZBy1sYr.js";import{r as n}from"./iframe-D13rUlhB.js";import{H as c,T as s}from"./Typography-Cmc6Gt2e.js";import"./utils-BmGQd4RS.js";import"./bundle-mjs-Ce1ZTWB2.js";import"./useControlled-D18dhzFV.js";import"./floating-ui.utils.dom-wHRPQCF9.js";import"./useRenderElement-CbcSstyx.js";import"./visuallyHidden-COI6QeQH.js";import"./useBaseUiId-C-sj7-By.js";import"./LabelableContext-DU2AqePP.js";import"./index-Bc5eE9t5.js";import"./index-0nySZKvk.js";import"./useAriaLabelledBy-CMAIAX4y.js";import"./useLabelableId-B5RE_ULw.js";import"./useValueChanged-Dd-7RhkP.js";import"./useButton-D9tzRV-Q.js";import"./preload-helper-PPVm8Dsz.js";const H={title:"UI/Switch",component:a,tags:["autodocs"],argTypes:{checked:{control:"boolean"},disabled:{control:"boolean"},onChange:{action:"changed"}}},t={args:{"aria-label":"Default switch"}},d=()=>{const[l,r]=n.useState(!1);return e.jsxs("div",{className:"pb:flex pb:flex-col pb:gap-2",children:[e.jsx(a,{checked:l,onChange:p=>r(p),"aria-label":"Interactive switch"}),e.jsxs(s,{variant:"small",children:["The switch is currently ",l?"on":"off","."]})]})},i={render:()=>e.jsxs("div",{className:"pb:flex pb:flex-col pb:gap-12 pb:p-4",children:[e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(c,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase",children:"States"}),e.jsxs("div",{className:"pb:flex pb:flex-col pb:gap-4",children:[e.jsxs("div",{className:"pb:flex pb:items-center pb:gap-2",children:[e.jsx(a,{defaultChecked:!1,"aria-label":"Unchecked switch"}),e.jsx(s,{variant:"small",children:"Unchecked"})]}),e.jsxs("div",{className:"pb:flex pb:items-center pb:gap-2",children:[e.jsx(a,{defaultChecked:!0,"aria-label":"Checked switch"}),e.jsx(s,{variant:"small",children:"Checked"})]}),e.jsxs("div",{className:"pb:flex pb:items-center pb:gap-2",children:[e.jsx(a,{disabled:!0,"aria-label":"Disabled switch"}),e.jsx(s,{variant:"small",children:"Disabled Unchecked"})]}),e.jsxs("div",{className:"pb:flex pb:items-center pb:gap-2",children:[e.jsx(a,{disabled:!0,defaultChecked:!0,"aria-label":"Disabled checked switch"}),e.jsx(s,{variant:"small",children:"Disabled Checked"})]})]})]}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(c,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase",children:"Interactive"}),e.jsx(d,{})]})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    "aria-label": "Default switch"
  }
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="pb:flex pb:flex-col pb:gap-12 pb:p-4">
      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          States
        </Heading>
        <div className="pb:flex pb:flex-col pb:gap-4">
          <div className="pb:flex pb:items-center pb:gap-2">
            <Switch defaultChecked={false} aria-label="Unchecked switch" />
            <Text variant="small">Unchecked</Text>
          </div>
          <div className="pb:flex pb:items-center pb:gap-2">
            <Switch defaultChecked={true} aria-label="Checked switch" />
            <Text variant="small">Checked</Text>
          </div>
          <div className="pb:flex pb:items-center pb:gap-2">
            <Switch disabled aria-label="Disabled switch" />
            <Text variant="small">Disabled Unchecked</Text>
          </div>
          <div className="pb:flex pb:items-center pb:gap-2">
            <Switch disabled defaultChecked={true} aria-label="Disabled checked switch" />
            <Text variant="small">Disabled Checked</Text>
          </div>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Interactive
        </Heading>
        <InteractiveSwitch />
      </div>
    </div>
}`,...i.parameters?.docs?.source}}};const I=["Default","Variations"];export{t as Default,i as Variations,I as __namedExportsOrder,H as default};
