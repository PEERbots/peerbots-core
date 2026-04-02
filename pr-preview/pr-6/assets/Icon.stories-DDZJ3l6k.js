import{j as e}from"./jsx-runtime-u17CrQMm.js";import{I as a}from"./Icon-DBJlkqnP.js";import{T as l}from"./Typography-Cmc6Gt2e.js";import"./iframe-D13rUlhB.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BmGQd4RS.js";import"./bundle-mjs-Ce1ZTWB2.js";const g={title:"UI/Icon",component:a,tags:["autodocs"],argTypes:{size:{control:"select",options:["sm","md","lg","xl"]},name:{control:"select",options:["arrowDown","arrowDownToLine","arrowDownTray","arrowPath","arrowRightOnRectangle","arrowUp","arrowUpFromLine","arrowUpTray","arrowsPointingIn","arrowsPointingOut","arrowsRightLeft","arrowsUpDown","check","checkCircle","chevronDownSmall","chevronDownTable","chevronRight","chevronUpSmall","chevronUpTable","clipboard","close","cloudArrowUp","code","document","edit","envelope","exclamationCircle","exclamationTriangle","export","externalLink","eye","folder","google","home","import","lock","lockClosed","magnifyingGlassPlus","megaphone","minus","pencilSquare","pencilSquareContinued","play","plus","questionMarkCircle","search","shoppingCart","speakerWave","squares","tableCells","userCircle","x","xCircle","zap"]}}},r=e.jsx("path",{d:"M20 6 9 17l-5-5"}),i=e.jsx("path",{d:"M18 6 6 18M6 6l12 12"}),n={args:{children:r,className:"text-green-500"}},s={render:()=>e.jsx("div",{className:"pb:grid pb:grid-cols-6 pb:gap-4 pb:p-4",children:["arrowDown","arrowDownToLine","arrowDownTray","arrowPath","arrowRightOnRectangle","arrowUp","arrowUpFromLine","arrowUpTray","arrowsPointingIn","arrowsPointingOut","arrowsRightLeft","arrowsUpDown","check","checkCircle","chevronDownSmall","chevronDownTable","chevronRight","chevronUpSmall","chevronUpTable","clipboard","close","cloudArrowUp","code","document","edit","envelope","exclamationCircle","exclamationTriangle","export","externalLink","eye","folder","google","home","import","lock","lockClosed","magnifyingGlassPlus","megaphone","minus","pencilSquare","pencilSquareContinued","play","plus","questionMarkCircle","search","shoppingCart","speakerWave","squares","tableCells","userCircle","x","xCircle","zap"].map(c=>e.jsxs("div",{className:"pb:flex pb:flex-col pb:items-center",children:[e.jsx(a,{name:c}),e.jsx(l,{variant:"small",children:c})]},c))})},o={render:()=>e.jsxs("div",{className:"pb:flex pb:flex-col pb:gap-12 pb:p-4",children:[e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(l,{variant:"small",className:"pb:font-bold pb:underline pb:uppercase",children:"Different Sizes"}),e.jsxs("div",{className:"pb:flex pb:items-end pb:gap-4",children:[e.jsx(a,{size:"sm",children:r}),e.jsx(a,{size:"md",children:r}),e.jsx(a,{size:"lg",children:r}),e.jsx(a,{size:"xl",children:r})]})]}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(l,{variant:"small",className:"pb:font-bold pb:underline pb:uppercase",children:"Different Content & Colors"}),e.jsxs("div",{className:"pb:flex pb:gap-4",children:[e.jsx(a,{className:"pb:text-red-500",children:i}),e.jsx(a,{className:"pb:text-primary",children:r})]})]}),e.jsxs("div",{className:"pb:space-y-4",children:[e.jsx(l,{variant:"small",className:"pb:font-bold pb:underline pb:uppercase",children:"Using Named Icons"}),e.jsxs("div",{className:"pb:flex pb:gap-4",children:[e.jsx(a,{name:"check",className:"pb:text-green-500"}),e.jsx(a,{name:"x",className:"pb:text-red-500"}),e.jsx(a,{name:"plus",className:"pb:text-blue-500"})]})]})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    children: CheckPath,
    className: "text-green-500"
  }
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div className="pb:grid pb:grid-cols-6 pb:gap-4 pb:p-4">
      {["arrowDown", "arrowDownToLine", "arrowDownTray", "arrowPath", "arrowRightOnRectangle", "arrowUp", "arrowUpFromLine", "arrowUpTray", "arrowsPointingIn", "arrowsPointingOut", "arrowsRightLeft", "arrowsUpDown", "check", "checkCircle", "chevronDownSmall", "chevronDownTable", "chevronRight", "chevronUpSmall", "chevronUpTable", "clipboard", "close", "cloudArrowUp", "code", "document", "edit", "envelope", "exclamationCircle", "exclamationTriangle", "export", "externalLink", "eye", "folder", "google", "home", "import", "lock", "lockClosed", "magnifyingGlassPlus", "megaphone", "minus", "pencilSquare", "pencilSquareContinued", "play", "plus", "questionMarkCircle", "search", "shoppingCart", "speakerWave", "squares", "tableCells", "userCircle", "x", "xCircle", "zap"].map(name => <div key={name} className="pb:flex pb:flex-col pb:items-center">
          <Icon name={name as IconName} />
          <Text variant="small">{name}</Text>
        </div>)}
    </div>
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="pb:flex pb:flex-col pb:gap-12 pb:p-4">
      <div className="pb:space-y-4">
        <Text variant="small" className="pb:font-bold pb:underline pb:uppercase">
          Different Sizes
        </Text>
        <div className="pb:flex pb:items-end pb:gap-4">
          <Icon size="sm">{CheckPath}</Icon>
          <Icon size="md">{CheckPath}</Icon>
          <Icon size="lg">{CheckPath}</Icon>
          <Icon size="xl">{CheckPath}</Icon>
        </div>
      </div>
      <div className="pb:space-y-4">
        <Text variant="small" className="pb:font-bold pb:underline pb:uppercase">
          Different Content & Colors
        </Text>
        <div className="pb:flex pb:gap-4">
          <Icon className="pb:text-red-500">{XPath}</Icon>
          <Icon className="pb:text-primary">{CheckPath}</Icon>
        </div>
      </div>
      <div className="pb:space-y-4">
        <Text variant="small" className="pb:font-bold pb:underline pb:uppercase">
          Using Named Icons
        </Text>
        <div className="pb:flex pb:gap-4">
          <Icon name="check" className="pb:text-green-500" />
          <Icon name="x" className="pb:text-red-500" />
          <Icon name="plus" className="pb:text-blue-500" />
        </div>
      </div>
    </div>
}`,...o.parameters?.docs?.source}}};const u=["Default","NamedIcons","Variations"];export{n as Default,s as NamedIcons,o as Variations,u as __namedExportsOrder,g as default};
