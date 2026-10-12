import Animated from 'react-native-reanimated';

import { registerAnimatedClassNames } from './animated-class-names';

// Reanimated 4 needs native worklets that Jest cannot load; each component is stood in for by a
// distinct function so the test can tell which one was registered with which mapping.
jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  default: {
    View: function AnimatedView() {},
    Text: function AnimatedText() {},
    Image: function AnimatedImage() {},
    ScrollView: function AnimatedScrollView() {},
  },
}));

describe('registerAnimatedClassNames', () => {
  test('maps className to style on Animated.View and Animated.Text', () => {
    const register = jest.fn();

    registerAnimatedClassNames(register);

    expect(register).toHaveBeenCalledWith(Animated.View, { className: 'style' });
    expect(register).toHaveBeenCalledWith(Animated.Text, { className: 'style' });
  });

  test('maps both className and contentContainerClassName on Animated.ScrollView', () => {
    const register = jest.fn();

    registerAnimatedClassNames(register);

    expect(register).toHaveBeenCalledWith(Animated.ScrollView, {
      className: 'style',
      contentContainerClassName: 'contentContainerStyle',
    });
  });

  test('registers every Reanimated component exactly once', () => {
    const register = jest.fn();

    registerAnimatedClassNames(register);

    const registeredComponents = register.mock.calls.map(([component]) => component);
    expect(new Set(registeredComponents).size).toBe(registeredComponents.length);
    expect(registeredComponents).toContain(Animated.Image);
  });
});
