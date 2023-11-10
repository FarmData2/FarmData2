import * as uiUtil from './uiUtil.js';

describe('Test the showInvalidStyling function', () => {
  it('Test ', () => {
    // valid value, show invalid styling.
    expect(uiUtil.showInvalidStyling(true, true)).to.be.true;
    // valid value, don't show invalid styling.
    expect(uiUtil.showInvalidStyling(true, false)).to.be.true;
    // invalid value, show invalid styling.
    expect(uiUtil.showInvalidStyling(false, true)).to.be.false;
    // invalid value, don't show invalid styling.
    expect(uiUtil.showInvalidStyling(false, false)).to.be.null;
  });
});
