import { isBeaconIdPromptOpen } from './beaconIdModal';

describe('beacon id modal logic', () => {
  /**
   * If user's current location isn't known (beacon ID is null), and user
   * clicks "Location sharing", verify that tracking prompt is opened.
   */
  it('shows beacon ID prompt if sharing location without known ID', () => {
    const beaconId = null;
    const isShareLocationModalOpen = true;
    const isPublicShareOpen = false;
    const isCentralizationButtonActive = false;
    const isSettingsModeActive = false;

    expect(
      isBeaconIdPromptOpen(
        beaconId,
        isShareLocationModalOpen,
        isPublicShareOpen,
        isCentralizationButtonActive,
        isSettingsModeActive
      )
    ).toBe(true);
  });

  it('shows beacon ID prompt if publishing location without known ID', () => {
    const beaconId = null;
    const isShareLocationModalOpen = false;
    const isPublicShareOpen = true;
    const isCentralizationButtonActive = false;
    const isSettingsModeActive = false;

    expect(
      isBeaconIdPromptOpen(
        beaconId,
        isShareLocationModalOpen,
        isPublicShareOpen,
        isCentralizationButtonActive,
        isSettingsModeActive
      )
    ).toBe(true);
  });
});
