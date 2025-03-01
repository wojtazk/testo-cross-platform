import React from 'react';
import { useAppContext } from '../AppContext';
import { IonText } from '@ionic/react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

export const ContentWithImages: React.FC<{
  content: string;
  transformImages: boolean;
}> = React.memo(({ content, transformImages }) => {
  const { quizState } = useAppContext();

  return (
    <>
      {/* ['hello', 'there', '[img]test.png[/img]'] */}
      {content
        .split(/(\[img\].*?\[\/img\])/)
        .filter((part) => part.trim() !== '')
        .map((part, index) => {
          if (part.startsWith('[img]')) {
            const imgName = (part.match(/\[img\](.*?)\[\/img\]/) || [''])[1];
            const imgExtension = imgName
              .slice(imgName.lastIndexOf('.'))
              .slice(1);
            const imgBase64 = quizState.images.find(
              (img) => img.name === imgName
            )?.imageBase64;

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <TransformWrapper
                  limitToBounds
                  minScale={1}
                  disabled={!transformImages}
                  doubleClick={{ disabled: false, mode: 'reset' }}
                >
                  <TransformComponent>
                    <img
                      src={`data:image/${imgExtension};base64,${imgBase64}`}
                      alt={imgName}
                    />
                  </TransformComponent>
                </TransformWrapper>
              </div>
            );
          } else {
            return <IonText key={index}>{part}</IonText>;
          }
        })}
    </>
  );
});
