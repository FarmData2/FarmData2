import * as farmosUtil from './farmosUtil.js';

describe('Test the extractQuantity function', () => {
  it('Test existing unitName', () => {
    expect(farmosUtil.extractQuantity('5 TRAYS (Count)', 'TRAYS')).to.equal(5);
    expect(farmosUtil.extractQuantity('250 TRAYS (Count)', 'TRAYS')).to.equal(
      250
    );
    expect(
      farmosUtil.extractQuantity(
        '2 TRAYS (Count), 102.5 FEET (Length/depth)',
        'TRAYS'
      )
    ).to.equal(2);
    expect(
      farmosUtil.extractQuantity(
        '2 TRAYS (Count), 102.5 FEET (Length/depth)',
        'FEET'
      )
    ).to.equal(102.5);
    expect(
      farmosUtil.extractQuantity(
        'Trays ( Count ) 3 TRAYS (Increment 2019-02-19_ts_LETTUCE-ICEBERG inventory), Tray Size ( Ratio ) 72 CELLS/TRAY, Seeds ( Count ) 216 SEEDS',
        'TRAYS'
      )
    ).to.equal(3);
    expect(
      farmosUtil.extractQuantity(
        'Trays ( Count ) 3 TRAYS (Increment 2019-02-19_ts_LETTUCE-ICEBERG inventory), Tray Size ( Ratio ) 72 CELLS/TRAY, Seeds ( Count ) 216 SEEDS',
        'CELLS/TRAY'
      )
    ).to.equal(72);
    expect(
      farmosUtil.extractQuantity(
        'Trays ( Count ) 3 TRAYS (Increment 2019-02-19_ts_LETTUCE-ICEBERG inventory), Tray Size ( Ratio ) 72 CELLS/TRAY, Seeds ( Count ) 216 SEEDS',
        'SEEDS'
      )
    ).to.equal(216);
  });

  it('Test non-existent unitName', () => {
    expect(
      farmosUtil.extractQuantity(
        '2 TRAYS (Count), 102.5 FEET (Length/depth)',
        'METERS'
      )
    ).to.be.null;
  });
});
