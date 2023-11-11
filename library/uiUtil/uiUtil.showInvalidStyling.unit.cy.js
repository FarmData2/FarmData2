import * as uiUtil from './uiUtil.js';

describe('Test the showInvalidStyling function', () => {
  it('Test ', () => {
    // valid value, show invalid styling.
    expect(uiUtil.validationStyling(true, true)).to.be.true;
    // valid value, don't show invalid styling.
    expect(uiUtil.validationStyling(true, false)).to.be.true;
    // invalid value, show invalid styling.
    expect(uiUtil.validationStyling(false, true)).to.be.false;
    // invalid value, don't show invalid styling.
    expect(uiUtil.validationStyling(false, false)).to.be.null;
  });
});
