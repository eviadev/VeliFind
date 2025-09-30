import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { TextEncoder, TextDecoder } from 'util';

if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder;
}

if (!globalThis.TextDecoder) {
  globalThis.TextDecoder = TextDecoder as unknown as typeof globalThis.TextDecoder;
}

const createReactMapGlMock = () => {
  const React = jest.requireActual<typeof import('react')>('react');

  const MockComponent = ({
    testId,
    children,
    ...props
  }: {
    testId: string;
    children?: React.ReactNode;
  }) => React.createElement('div', { ...props, 'data-testid': testId }, children);

  const MockMap = ({ children, ...props }: { children?: React.ReactNode }) =>
    React.createElement(MockComponent, { ...props, testId: 'map' }, children);

  const MockMarker = ({ children }: { children?: React.ReactNode }) =>
    React.createElement(MockComponent, { testId: 'marker' }, children);

  const MockPopup = ({ children }: { children?: React.ReactNode }) =>
    React.createElement(MockComponent, { testId: 'popup' }, children);

  return {
    __esModule: true,
    default: MockMap,
    Marker: MockMarker,
    Popup: MockPopup,
    NavigationControl: () => React.createElement(MockComponent, { testId: 'navigation-control' }),
    FullscreenControl: () => React.createElement(MockComponent, { testId: 'fullscreen-control' }),
  };
};

jest.mock('react-map-gl', () => createReactMapGlMock());
jest.mock('react-map-gl/maplibre', () => createReactMapGlMock());

jest.mock('maplibre-gl', () => ({}));
