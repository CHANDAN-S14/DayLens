import User from '../models/User.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  return ApiResponse.success(res, user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, targetSleep, targetSteps, targetScreenLimit, units, timeFormat, theme } = req.body;

  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (targetSleep !== undefined) updateFields.targetSleep = Number(targetSleep);
  if (targetSteps !== undefined) updateFields.targetSteps = Number(targetSteps);
  if (targetScreenLimit !== undefined) updateFields.targetScreenLimit = Number(targetScreenLimit);
  if (units !== undefined) updateFields.units = units;
  if (timeFormat !== undefined) updateFields.timeFormat = timeFormat;
  if (theme !== undefined) updateFields.theme = theme;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateFields,
    { new: true, runValidators: true }
  ).select('-password');

  return ApiResponse.success(res, user, 'Profile preferences updated successfully');
});
