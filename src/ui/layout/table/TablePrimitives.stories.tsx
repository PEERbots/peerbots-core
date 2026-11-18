import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
  TableRowHeader,
} from "./TablePrimitives";

const meta: Meta<typeof TableRoot> = {
  title: "Layout/Table/TablePrimitives",
  component: TableRoot,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Composable semantic table primitives (`TableContainer`, `TableRoot`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableRowHeader`, `TableCell`, `TableCaption`) extracted for custom table layouts.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TableRoot>;

export const Default: Story = {
  render: () => (
    <TableContainer>
      <TableRoot>
        <TableCaption>Robot Preset Summary</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Preset</TableHead>
            <TableHead>Color</TableHead>
            <TableHead align="end">Buttons</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableRowHeader>Starter Social</TableRowHeader>
            <TableCell>Light Blue</TableCell>
            <TableCell align="end">6</TableCell>
          </TableRow>
          <TableRow selected>
            <TableRowHeader>Q&amp;A and Colors</TableRowHeader>
            <TableCell>Green</TableCell>
            <TableCell align="end">12</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell align="end">18</TableCell>
          </TableRow>
        </TableFooter>
      </TableRoot>
    </TableContainer>
  ),
};

export const Variations: Story = {
  render: () => (
    <div className="pb:space-y-6">
      <TableContainer variant="outline" radius="md">
        <TableRoot>
          <TableHeader>
            <TableRow>
              <TableHead density="compact">Compact Striped</TableHead>
              <TableHead density="compact">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell density="compact">Row 1</TableCell>
              <TableCell density="compact">Active</TableCell>
            </TableRow>
            <TableRow>
              <TableCell density="compact">Row 2</TableCell>
              <TableCell density="compact">Ready</TableCell>
            </TableRow>
          </TableBody>
        </TableRoot>
      </TableContainer>
    </div>
  ),
};
