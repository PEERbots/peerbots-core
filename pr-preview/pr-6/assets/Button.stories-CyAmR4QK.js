import{j as e}from"./jsx-runtime-u17CrQMm.js";import{B as n}from"./Button-bHTpVbF1.js";import{I as a}from"./Icon-DBJlkqnP.js";import{H as s}from"./Typography-Cmc6Gt2e.js";import"./iframe-D13rUlhB.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BmGQd4RS.js";import"./bundle-mjs-Ce1ZTWB2.js";import"./useButton-D9tzRV-Q.js";import"./floating-ui.utils.dom-wHRPQCF9.js";import"./useRenderElement-CbcSstyx.js";const v={title:"UI/Button",component:n,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:"select",options:["primary","secondary","danger","ghost","ghostly-danger"]},size:{control:"select",options:["sm","md","lg"]},disabled:{control:"boolean"},isLoading:{control:"boolean"},onClick:{action:"clicked"}}},t={args:{children:"Button",variant:"primary"}},i={render:()=>e.jsxs("div",{className:"pb:flex pb:flex-col pb:gap-8",children:[e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(s,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:italic",children:"Variants"}),e.jsxs("div",{className:"pb:flex pb:flex-wrap pb:gap-4 pb:items-center",children:[e.jsx(n,{variant:"primary",children:"Primary"}),e.jsx(n,{variant:"secondary",children:"Secondary"}),e.jsx(n,{variant:"danger",children:"Danger"}),e.jsx(n,{variant:"ghost",children:"Ghost"}),e.jsx(n,{variant:"ghostly-danger",children:"Ghostly Danger"})]})]}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(s,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:italic",children:"Sizes"}),e.jsxs("div",{className:"pb:flex pb:flex-wrap pb:gap-4 pb:items-end",children:[e.jsx(n,{size:"sm",children:"Small"}),e.jsx(n,{size:"md",children:"Medium"}),e.jsx(n,{size:"lg",children:"Large"})]})]}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(s,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:italic",children:"States"}),e.jsxs("div",{className:"pb:flex pb:flex-wrap pb:gap-4 pb:items-center",children:[e.jsx(n,{isLoading:!0,children:"Loading"}),e.jsx(n,{disabled:!0,children:"Disabled"})]})]}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(s,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:italic",children:"With Icons"}),e.jsxs("div",{className:"pb:flex pb:flex-wrap pb:gap-4 pb:items-center",children:[e.jsx(n,{leftIcon:e.jsx(a,{name:"cloudArrowUp"}),children:"Upload"}),e.jsx(n,{variant:"secondary",rightIcon:e.jsx(a,{name:"chevronRight"}),children:"Next"})]})]}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(s,{level:4,className:"pb:text-sm pb:font-medium pb:text-black pb:italic",children:"Icon Only"}),e.jsxs("div",{className:"pb:flex pb:flex-wrap pb:gap-4 pb:items-center",children:[e.jsx(n,{size:"sm",children:e.jsx(a,{name:"plus"})}),e.jsx(n,{size:"md",children:e.jsx(a,{name:"plus"})}),e.jsx(n,{size:"lg",children:e.jsx(a,{name:"plus"})}),e.jsx(n,{variant:"ghost",size:"sm","aria-label":"Close",children:e.jsx(a,{name:"close"})})]})]})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Button",
    variant: "primary"
  }
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="pb:flex pb:flex-col pb:gap-8">
      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:italic">
          Variants
        </Heading>
        <div className="pb:flex pb:flex-wrap pb:gap-4 pb:items-center">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="ghostly-danger">Ghostly Danger</Button>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:italic">
          Sizes
        </Heading>
        <div className="pb:flex pb:flex-wrap pb:gap-4 pb:items-end">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:italic">
          States
        </Heading>
        <div className="pb:flex pb:flex-wrap pb:gap-4 pb:items-center">
          <Button isLoading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:italic">
          With Icons
        </Heading>
        <div className="pb:flex pb:flex-wrap pb:gap-4 pb:items-center">
          <Button leftIcon={<Icon name="cloudArrowUp" />}>Upload</Button>
          <Button variant="secondary" rightIcon={<Icon name="chevronRight" />}>
            Next
          </Button>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:italic">
          Icon Only
        </Heading>
        <div className="pb:flex pb:flex-wrap pb:gap-4 pb:items-center">
          <Button size="sm">
            <Icon name="plus" />
          </Button>
          <Button size="md">
            <Icon name="plus" />
          </Button>
          <Button size="lg">
            <Icon name="plus" />
          </Button>
          <Button variant="ghost" size="sm" aria-label="Close">
            <Icon name="close" />
          </Button>
        </div>
      </div>
    </div>
}`,...i.parameters?.docs?.source}}};const h=["Default","Variations"];export{t as Default,i as Variations,h as __namedExportsOrder,v as default};
