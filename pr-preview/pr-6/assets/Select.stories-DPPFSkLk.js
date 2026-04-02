import{j as e}from"./jsx-runtime-u17CrQMm.js";import{S as p}from"./Select-Nl3GrG_V.js";import{H as o,T as t}from"./Typography-Cmc6Gt2e.js";import"./iframe-D13rUlhB.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BmGQd4RS.js";import"./bundle-mjs-Ce1ZTWB2.js";import"./Icon-DBJlkqnP.js";import"./visuallyHidden-COI6QeQH.js";import"./useRenderElement-CbcSstyx.js";import"./useOnFirstRender-CtD386ZA.js";import"./index-Bc5eE9t5.js";import"./index-0nySZKvk.js";import"./floating-ui.utils.dom-wHRPQCF9.js";import"./useBaseUiId-C-sj7-By.js";import"./detectBrowser-B_JuCNHz.js";import"./owner-CvMgaIeV.js";import"./element-D2Kx1mQN.js";import"./constants-CRqqCNE_.js";import"./useTimeout-DzBo7X4D.js";import"./useOnMount-CaSRcZyW.js";import"./event-y5gTa7kU.js";import"./index-CbzWsoC_.js";import"./useOpenChangeComplete-BCUGvzLt.js";import"./useAnimationFrame-Cn-dUaus.js";import"./useControlled-D18dhzFV.js";import"./useValueAsRef-BINbF6HZ.js";import"./LabelableContext-DU2AqePP.js";import"./useLabelableId-B5RE_ULw.js";import"./useValueChanged-Dd-7RhkP.js";import"./InternalBackdrop-DEciqa4c.js";import"./composite-BH_q_e9x.js";import"./floating-ui.utils-BPjIC1MX.js";import"./getDisabledMountTransitionStyles-DcnzfQve.js";import"./DirectionContext-BdY38WrA.js";import"./CSPContext-D2BQPVPk.js";import"./useButton-D9tzRV-Q.js";import"./useCompositeListItem-D1kmGiIX.js";import"./ToolbarRootContext-Bn6ej6kI.js";import"./composite-DmhsLiSx.js";import"./clamp-DyuOe9kr.js";const W={title:"UI/Select",component:p,tags:["autodocs"],argTypes:{disabled:{control:"boolean"},onChange:{action:"changed"}}},i=["Option 1","Option 2","Option 3"],l=[{label:"Banana",value:"banana"},{label:"Apple",value:"apple"},{label:"Orange",value:"orange"}],a={args:{options:i,placeholder:"Select an option..."}},s={render:()=>e.jsxs("div",{className:"pb:flex pb:flex-col pb:gap-8 pb:p-4 pb:max-w-sm",children:[e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(o,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase",children:"Option Types"}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsxs("div",{className:"pb:space-y-1",children:[e.jsx(t,{variant:"small",className:"pb:font-bold",children:"String Options"}),e.jsx(p,{options:i})]}),e.jsxs("div",{className:"pb:space-y-1",children:[e.jsx(t,{variant:"small",className:"pb:font-bold",children:"Object Options (Label/Value)"}),e.jsx(p,{options:l,defaultValue:"apple"})]})]})]}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(o,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase",children:"States"}),e.jsx("div",{className:"pb:space-y-4",children:e.jsxs("div",{className:"pb:space-y-1",children:[e.jsx(t,{variant:"small",className:"pb:font-bold",children:"Disabled"}),e.jsx(p,{options:i,disabled:!0,placeholder:"Can't select"})]})})]})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    options: simpleOptions,
    placeholder: "Select an option..."
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div className="pb:flex pb:flex-col pb:gap-8 pb:p-4 pb:max-w-sm">
      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Option Types
        </Heading>
        <div className="pb:space-y-4">
          <div className="pb:space-y-1">
            <Text variant="small" className="pb:font-bold">
              String Options
            </Text>
            <Select options={simpleOptions} />
          </div>
          <div className="pb:space-y-1">
            <Text variant="small" className="pb:font-bold">
              Object Options (Label/Value)
            </Text>
            <Select options={objectOptions} defaultValue="apple" />
          </div>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          States
        </Heading>
        <div className="pb:space-y-4">
          <div className="pb:space-y-1">
            <Text variant="small" className="pb:font-bold">
              Disabled
            </Text>
            <Select options={simpleOptions} disabled placeholder="Can't select" />
          </div>
        </div>
      </div>
    </div>
}`,...s.parameters?.docs?.source}}};const X=["Default","Variations"];export{a as Default,s as Variations,X as __namedExportsOrder,W as default};
