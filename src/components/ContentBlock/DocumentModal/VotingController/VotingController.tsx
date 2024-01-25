import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Localization } from '@/enums/Localization';

import { takeApplicationItem, voteApplicationItem } from '@/api/applicationService';
import authStore from '@/stores/AuthStore';
import alertStore from '@/stores/AlertStore';

import style from './votingController.module.css';
import plusIcon from '@/assets/plus.png';

interface VotingControllerProps {
  appId: string | undefined;
  appItemId: string | undefined;
  toggle: (() => void) | null;
  closeModal: () => void;
}

const VotingController: React.FC<VotingControllerProps> = ({
  appId,
  appItemId,
  toggle,
  closeModal,
}) => {
  const [resStatus, setResStatus] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { t } = useTranslation();

  const takeApplication = () => {
    const take = async () => {
      try {
        if (appId && appItemId) {
          if (authStore.token) {
            const res = await takeApplicationItem(authStore.token, +appItemId, +appId);
            //setResStatus(res ? 1 : 0);
            res && setResStatus(1);
          }
        } else alertStore.toggleAlert(t(`${Localization.UserPanel}.errorAlert`));
      } catch (e) {
        alertStore.toggleAlert((e as Error).message);
      }
    };

    take();
  };

  const handleVoteOption = (option: 'ACCEPTED' | 'DENIED') => {
    setSelectedOption(option);
  };

  const handleVoteSubmit = () => {
    setFormSubmitted(true);
    const obj = {
      status: selectedOption!,
      comment: 'string',
    };
    (async () => {
      try {
        if (appId && appItemId) {
          if (authStore.token) {
            const res = await voteApplicationItem(authStore.token, +appItemId, +appId, obj);
            res && closeModal(), alertStore.toggleAlert('Вы успешно проголосовали');
          }
        } else alertStore.toggleAlert(t(`${Localization.UserPanel}.errorAlert`));
      } catch (e) {
        alertStore.toggleAlert((e as Error).message);
      }
    })();
  };

  return (
    <>
      {!appId && !appItemId && toggle && (
        <div className={style.dataList__controls} onClick={toggle}>
          <img className={style.dataList__img} src={plusIcon} alt='+' />
          <button className={style.dataList__button}>
            {t(`${Localization.DocumentPanel}.AddApplication`)}
          </button>
        </div>
      )}
      {appId && appItemId && !resStatus && (
        <div className={style.vote}>
          <button className={style.vote__button} onClick={takeApplication}>
            {'Голосовать'}
          </button>
        </div>
      )}
      {appId && appItemId && resStatus && (
        <>
          <h1 className={style.title}>Голосование за документ:</h1>
          <div className={style.info}>
            <div className={style.voteButtons}>
              <button
                className={`${style.voteButton} ${style.choice} ${
                  selectedOption === 'ACCEPTED' && style.active
                }`}
                onClick={() => handleVoteOption('ACCEPTED')}
                disabled={formSubmitted}
              >
                За
              </button>
              <button
                className={`${style.voteButton} ${style.choice} ${
                  selectedOption === 'DENIED' && style.active
                }`}
                onClick={() => handleVoteOption('DENIED')}
                disabled={formSubmitted}
              >
                Против
              </button>
            </div>
            <button
              className={`${style.voteButton} ${style.choice}`}
              onClick={handleVoteSubmit}
              disabled={!selectedOption || formSubmitted}
            >
              Проголосовать
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default VotingController;
