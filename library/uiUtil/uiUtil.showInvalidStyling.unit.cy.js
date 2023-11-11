import * as uiUtil from './uiUtil.js';

describe('Test the validStyling function', () => {
  it('Test the four cases that exist', () => {
    //                            iValid show
    expect(uiUtil.validityStyling(false, false)).to.be.null;
    expect(uiUtil.validityStyling(false, true)).to.be.false;
    expect(uiUtil.validityStyling(true, false)).to.be.null;
    expect(uiUtil.validityStyling(true, true)).to.be.true;
  });

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
