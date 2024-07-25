import type { Meta, StoryObj } from '@storybook/angular';
import { fn, userEvent, expect } from '@storybook/test';
import { ButtonComponent } from './button.component';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<ButtonComponent> = {
  title: 'Example/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: {
      control: 'color',
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { clickCount: fn() },
};

export default meta;
type Story = StoryObj<ButtonComponent>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
  play: async ({canvasElement,args}) => {
    const button = canvasElement.querySelector('button') as HTMLButtonElement

    await userEvent.click(button)
    expect(args.clickCount).toHaveBeenCalledWith(1)
    await userEvent.click(button)
    expect(args.clickCount).toHaveBeenCalledWith(2)
    await userEvent.click(button)
    expect(args.clickCount).toHaveBeenCalledWith(3)
  }
};

export const Secondary: Story = {
  args: {
    label: 'Button',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Button',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Button',
  },
};
