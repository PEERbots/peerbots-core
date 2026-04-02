import{j as e}from"./jsx-runtime-u17CrQMm.js";import{T as t,H as r}from"./Tooltip-dSEDCyU0.js";import{B as a}from"./Button-bHTpVbF1.js";import{H as i}from"./Typography-Cmc6Gt2e.js";import"./iframe-D13rUlhB.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BmGQd4RS.js";import"./bundle-mjs-Ce1ZTWB2.js";import"./Icon-DBJlkqnP.js";import"./useTimeout-DzBo7X4D.js";import"./useRenderElement-CbcSstyx.js";import"./useOnMount-CaSRcZyW.js";import"./floating-ui.utils.dom-wHRPQCF9.js";import"./event-y5gTa7kU.js";import"./detectBrowser-B_JuCNHz.js";import"./useBaseUiId-C-sj7-By.js";import"./useOnFirstRender-CtD386ZA.js";import"./index-Bc5eE9t5.js";import"./index-0nySZKvk.js";import"./visuallyHidden-COI6QeQH.js";import"./owner-CvMgaIeV.js";import"./element-D2Kx1mQN.js";import"./constants-CRqqCNE_.js";import"./index-CbzWsoC_.js";import"./useOpenChangeComplete-BCUGvzLt.js";import"./useAnimationFrame-Cn-dUaus.js";import"./useSyncedFloatingRootContext-CcBzBcFp.js";import"./useValueAsRef-BINbF6HZ.js";import"./getDisabledMountTransitionStyles-DcnzfQve.js";import"./floating-ui.utils-BPjIC1MX.js";import"./DirectionContext-BdY38WrA.js";import"./useButton-D9tzRV-Q.js";const q={title:"UI/Tooltip",component:t,tags:["autodocs"],argTypes:{content:{control:"text"},delay:{control:"radio",options:["normal","slow"]}},decorators:[p=>e.jsx("div",{className:"pb:flex pb:h-32 pb:items-center pb:justify-center",children:e.jsx(p,{})})]},s={args:{content:"This is a tooltip",children:e.jsx("span",{children:"Hover me"})}},o={decorators:[p=>e.jsx("div",{className:"pb:p-12",children:e.jsx(p,{})})],render:()=>e.jsxs("div",{className:"pb:flex pb:flex-col pb:gap-16",children:[e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(i,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase",children:"Placements & Triggers"}),e.jsxs("div",{className:"pb:flex pb:flex-wrap pb:gap-8 pb:items-center pb:justify-center",children:[e.jsx(t,{content:"Tooltip on button",children:e.jsx(a,{children:"On Button"})}),e.jsx(t,{content:"Simple span trigger",children:e.jsx("span",{className:"pb:cursor-help pb:underline pb:decoration-dotted",children:"On Text"})})]})]}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(i,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase",children:"Configurations"}),e.jsxs("div",{className:"pb:flex pb:flex-wrap pb:gap-8 pb:items-center pb:justify-center",children:[e.jsx(t,{content:"I appear slowly",delay:"slow",children:e.jsx(a,{variant:"secondary",children:"Slow Delay (1s)"})}),e.jsx(t,{content:"This is a very long tooltip message that should wrap nicely within the tooltip bounds instead of overflowing outside the container.",children:e.jsx(a,{variant:"ghost",children:"Long Content wrapping"})})]})]}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(i,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:uppercase",children:"Helper Tooltip"}),e.jsxs("div",{className:"pb:flex pb:flex-wrap pb:gap-8 pb:items-center pb:justify-center",children:[e.jsx(r,{content:"I'm a helper"}),e.jsx(r,{content:"This is a much longer message that is trying to illustrate what happens when we have a long message for the helper tooltip."})]})]})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    content: "This is a tooltip",
    children: <span>Hover me</span>
  }
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <div className="pb:p-12">
        <Story />
      </div>],
  render: () => <div className="pb:flex pb:flex-col pb:gap-16">
      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Placements & Triggers
        </Heading>
        <div className="pb:flex pb:flex-wrap pb:gap-8 pb:items-center pb:justify-center">
          <Tooltip content="Tooltip on button">
            <Button>On Button</Button>
          </Tooltip>
          <Tooltip content="Simple span trigger">
            <span className="pb:cursor-help pb:underline pb:decoration-dotted">
              On Text
            </span>
          </Tooltip>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Configurations
        </Heading>
        <div className="pb:flex pb:flex-wrap pb:gap-8 pb:items-center pb:justify-center">
          <Tooltip content="I appear slowly" delay="slow">
            <Button variant="secondary">Slow Delay (1s)</Button>
          </Tooltip>
          <Tooltip content="This is a very long tooltip message that should wrap nicely within the tooltip bounds instead of overflowing outside the container.">
            <Button variant="ghost">Long Content wrapping</Button>
          </Tooltip>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Helper Tooltip
        </Heading>
        <div className="pb:flex pb:flex-wrap pb:gap-8 pb:items-center pb:justify-center">
          <HelperTooltip content="I'm a helper" />
          <HelperTooltip content="This is a much longer message that is trying to illustrate what happens when we have a long message for the helper tooltip." />
        </div>
      </div>
    </div>
}`,...o.parameters?.docs?.source}}};const z=["Default","Variations"];export{s as Default,o as Variations,z as __namedExportsOrder,q as default};
