import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CasinoIcon from '@material-ui/icons/CasinoRounded';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { ISelectOption } from '../../interfaces/select-option.interface';
import { IStashTab } from '../../interfaces/stash.interface';
import { Character } from '../../store/domains/character';
import { League } from '../../store/domains/league';
import { placeholderOption } from '../../utils/misc.utils';
import { generateProfileName } from '../../utils/profile.utils';
import { noCharError } from '../../utils/validation.utils';
import CheckboxField from '../checkbox-field/CheckboxField';
import LeagueDropdown from '../league-dropdown/LeagueDropdown';
import PriceLeagueDropdown from '../price-league-dropdown/PriceLeagueDropdown';
import RequestButton from '../request-button/RequestButton';
import SelectField from '../select-field/SelectField';
import SimpleField from '../simple-field/SimpleField';
import StashTabDropdown from '../stash-tab-dropdown/StashTabDropdown';
import { Profile } from './../../store/domains/profile';
import useStyles from './ProfileDialog.styles';

export interface ProfileFormValues {
  profileName: string;
  league?: string;
  priceLeague?: string;
  stashTabIds?: string[];
  includeEquipment?: boolean;
  includeInventory?: boolean;
  character: string;
}

type ProfileDialogProps = {
  isOpen: boolean;
  loading: boolean;
  isEditing?: boolean;
  profile?: Profile;
  characterName: string;
  leagueUuid: string;
  priceLeagueUuid: string;
  leagues: League[];
  priceLeagues: League[];
  stashTabs: IStashTab[];
  selectedStashTabs: IStashTab[];
  characters: Character[];
  includeInventory?: boolean;
  includeEquipment?: boolean;
  handleClickClose: () => void;
  handleLeagueChange: (event: ChangeEvent<{ value: unknown }>) => void;
  handleSubmit: (values: ProfileFormValues) => void;
  handleStashTabChange: (event: ChangeEvent<{}>, value: IStashTab[]) => void;
};

const ProfileDialog = ({
  isOpen,
  loading,
  isEditing,
  profile,
  leagueUuid,
  includeInventory,
  includeEquipment,
  priceLeagueUuid,
  leagues,
  priceLeagues,
  stashTabs,
  selectedStashTabs,
  characters,
  handleClickClose,
  handleLeagueChange,
  handleSubmit,
  characterName,
  handleStashTabChange,
}: ProfileDialogProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const noCharacters = t(noCharError(characters));
  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={() => handleClickClose()}
        aria-labelledby="profile-dialog-title"
      >
        <DialogTitle id="profile-dialog-title">
          {isEditing ? t('title.save_profile') : t('title.create_profile')}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Formik
            initialValues={{
              profileName: isEditing && profile ? profile.name : generateProfileName(),
              league: leagueUuid,
              priceLeague: priceLeagueUuid,
              selectedStashTabs: selectedStashTabs,
              character: characterName,
              includeEquipment: includeEquipment,
              includeInventory: includeInventory,
            }}
            onSubmit={(values: ProfileFormValues) => {
              handleSubmit(values);
            }}
            validationSchema={Yup.object().shape({
              profileName: Yup.string().required('Required'),
              league: Yup.string().required('Required'),
              priceLeague: Yup.string().required('Required'),
            })}
          >
            {/* todo: refactor and use new formik */}
            {({
              values,
              touched,
              errors,
              handleChange,
              handleSubmit,
              dirty,
              isValid,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit}>
                <SimpleField
                  name="profileName"
                  type="text"
                  label={t('label.profile_name')}
                  placeholder={t('label.profile_name_placeholder')}
                  endIcon={
                    <IconButton
                      aria-label="generate"
                      title={t('label.generate_name_icon_title')}
                      edge="start"
                      size="small"
                      onClick={() => {
                        const name = generateProfileName();
                        setFieldValue('profileName', name);
                      }}
                    >
                      <CasinoIcon />
                    </IconButton>
                  }
                  required
                  autoFocus
                />
                <PriceLeagueDropdown
                  priceLeagues={priceLeagues}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  values={values}
                />
                <LeagueDropdown
                  leagues={leagues}
                  touched={touched}
                  errors={errors}
                  fullWidth
                  noCharacters={noCharacters}
                  handleLeagueChange={handleLeagueChange}
                  handleChange={handleChange}
                  values={values}
                />
                <StashTabDropdown
                  stashTabs={stashTabs}
                  selectedStashTabs={selectedStashTabs}
                  handleStashTabChange={handleStashTabChange}
                  handleChange={handleChange}
                  marginBottom={3}
                  marginTop={2}
                  displayCountWarning
                />
                <Box mt={2}>
                  <SelectField
                    name="character"
                    label={t('label.select_character')}
                    options={characters?.map((c) => {
                      return {
                        id: c.name,
                        value: c.name,
                        label: c.name,
                      } as ISelectOption;
                    })}
                    hasPlaceholder
                  />
                  <CheckboxField
                    name="includeEquipment"
                    label={t('label.include_equipment')}
                    disabled={!values.character || values.character === placeholderOption}
                  />
                  <CheckboxField
                    name="includeInventory"
                    label={t('label.include_inventory')}
                    disabled={!values.character || values.character === placeholderOption}
                  />
                </Box>
                <div className={classes.dialogActions}>
                  <Button onClick={() => handleClickClose()}>{t('action.cancel')}</Button>
                  <RequestButton
                    variant="contained"
                    type="submit"
                    color="primary"
                    loading={loading}
                    disabled={loading || noCharacters.length > 0 || (dirty && !isValid)}
                  >
                    {isEditing ? t('action.save_profile') : t('action.create_profile')}
                  </RequestButton>
                </div>
              </form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileDialog;
