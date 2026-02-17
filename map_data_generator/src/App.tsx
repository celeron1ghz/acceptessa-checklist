import React, { useState, useRef } from 'react';
import yaml from 'js-yaml';
import './index.css';

const INIT_INPUT_CONFIG_VALUE: InputConfig = {
  tweet: { url: "", related: "", hashtags: "" },
  marker_size: { width: 15, height: 20 },
  horizontal_space: [
    { top: 50, lefts: ["100", "+2", "+2", "+2"], sym: "A", num: 1, reverse: false },
  ],
  vertial_space: [
    { left: 50, tops: ["30", "+2", "+2", "+2"], sym: "B", num: 1, reverse: false },
  ],
  custom_space: [
    { l: 150, t: 100, w: 30, h: 30, s: "王", n: "1" },
  ],
};

const INIT_OUTPUT_CONFIG_VALUE: OutputConfig = {
  map: { image_height: 0, image_width: 0, mappings: [] },
  tweet: { url: "", related: "", hashtags: "" },
};

const App: React.FC = () => {
  const [imageRawData, setImageRawData] = useState<InputImageData | null>(null);
  const [imageScale, setImageScale] = useState<number>(1.5);
  const [clickCoord, setClickCoord] = useState<{ x: number; y: number } | null>(null);
  const [inputConfig, setInputConfig] = useState<InputConfig>(INIT_INPUT_CONFIG_VALUE);
  const [outputConfig, setOutputConfig] = useState<OutputConfig>(INIT_OUTPUT_CONFIG_VALUE);
  const [inputYamlText, setInputYamlText] = useState<string>('');
  const [inputYamlError, setInputYamlError] = useState<string>('');

  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result as string;
        const img = new Image();
        img.onload = () => {
          setImageRawData({ width: img.width, height: img.height, src: result });
        };

        img.src = result;
        setClickCoord(null);

        setInputConfig(INIT_INPUT_CONFIG_VALUE);
        updateYaml(yaml.dump(INIT_INPUT_CONFIG_VALUE));
      };

      reader.readAsDataURL(file);
    }
  };

  const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageScale(Number(event.target.value));
  };

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    const img = imageRef.current;

    if (img) {
      const rect = img.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      const x = Math.round(offsetX / imageScale);
      const y = Math.round(offsetY / imageScale);
      setClickCoord({ x, y });
    }
  };

  const handleYamlChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateYaml(event.target.value);
  };

  const updateYaml = function (yamlString: string) {
    setInputYamlText(yamlString);
    setInputYamlError('');

    try {
      const newConfig = yaml.load(yamlString) as InputConfig;
      setInputConfig(newConfig);

      let coords: OutputCoords[] = [];

      if (newConfig.vertial_space) {
        for (const vertial of newConfig.vertial_space) {
          let translated: OutputCoords[] = [];
          let previousTop = 0;

          for (const top of vertial.tops) {
            let currentTop: number;

            const ret = String(top).match(/^([+-])(\d+)$/);

            if (ret) {
              const op = ret[1];
              const num = Number(ret[2]);

              if (op === '-') {
                currentTop = previousTop + newConfig.marker_size.height - num;
              } else {
                currentTop = previousTop + newConfig.marker_size.height + num;
              }
            } else {
              currentTop = Number(top);
            }

            translated.push({
              l: vertial.left,
              t: currentTop,
              s: vertial.sym,
              n: "0", // real value set after
              w: newConfig.marker_size.width,
              h: newConfig.marker_size.height
            });

            previousTop = currentTop;
          }

          if (vertial.reverse) {
            translated = translated.reverse();
          }

          let cnt = vertial.num || 1;

          for (const t of translated) {
            t.n = String(cnt++);
          }

          coords.push(...translated);
        }
      }

      if (newConfig.horizontal_space) {
        for (const horizontal of newConfig.horizontal_space) {
          let translated: OutputCoords[] = [];
          let previousLeft = 0;

          for (const left of horizontal.lefts) {
            let currentLeft: number;

            const ret = String(left).match(/^([+-])(\d+)$/);

            if (ret) {
              const op = ret[1];
              const num = Number(ret[2]);

              if (op === '-') {
                currentLeft = previousLeft + newConfig.marker_size.width - num;
              } else {
                currentLeft = previousLeft + newConfig.marker_size.width + num;
              }
            } else {
              currentLeft = Number(left);
            }

            translated.push({
              l: currentLeft,
              t: horizontal.top,
              s: horizontal.sym,
              n: "0", // real value set after
              w: newConfig.marker_size.width,
              h: newConfig.marker_size.height
            });

            previousLeft = currentLeft;
          }

          if (horizontal.reverse) {
            translated = translated.reverse();
          }

          let cnt = horizontal.num || 1;

          for (const t of translated) {
            t.n = String(cnt++);
          }

          coords.push(...translated);
        }
      }

      if (newConfig.custom_space) {
        coords.push(...newConfig.custom_space);
      }

      setOutputConfig({
        tweet: newConfig.tweet,
        map: {
          image_width: imageRawData?.width || 0,
          image_height: imageRawData?.height || 0,
          mappings: coords,
        },
      });
    } catch (e: any) {
      setInputYamlError(e.toString());
    }
  }

  const saveYaml = () => {
    const fileName = 'input.yaml';
    const data = new Blob([inputYamlText], { type: 'text/yaml' });
    const jsonURL = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = jsonURL;
    link.setAttribute('download', fileName);
    link.click();
    document.body.removeChild(link);
  }

  const saveJson = () => {
    const fileName = 'input.json';
    const data = new Blob([JSON.stringify(outputConfig)], { type: 'text/json' });
    const jsonURL = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = jsonURL;
    link.setAttribute('download', fileName);
    link.click();
    document.body.removeChild(link);
  }

  let coords = outputConfig.map.mappings;

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {!imageRawData && <h3>画像を選択してください</h3>}
      {imageRawData && (
        <>
          <div
            ref={containerRef}
            style={{
              width: '100%',
              height: '400px',
              overflow: 'auto',
              border: '1px solid #ccc',
              position: 'relative',
            }}
          >
            <img
              ref={imageRef}
              src={imageRawData.src}
              alt="Selected"
              style={{ width: `${imageRawData.width * imageScale}px` }}
              onClick={handleImageClick}
            />
            {coords.map((coord, index) => (
              <div
                className="coord"
                key={index}
                style={{
                  left: `${coord.l * imageScale}px`,
                  top: `${coord.t * imageScale}px`,
                  width: `${coord.w * imageScale}px`,
                  height: `${coord.h * imageScale}px`,
                  fontSize: `${Math.floor(7 * imageScale)}px`,
                }}
              >{coord.s}{coord.n}</div>
            ))}
            {
              clickCoord && <div
                className="click"
                style={{
                  left: `${clickCoord.x * imageScale}px`,
                  top: `${clickCoord.y * imageScale}px`,
                  width: `${65 * imageScale}px`,
                  height: `${15 * imageScale}px`,
                  fontSize: `${Math.floor(10 * imageScale)}px`,
                }}
              >X={clickCoord.x}, Y={clickCoord.y}</div>
            }
          </div>

          <div className="input">
            <div>
              <h4>入力(YAML)</h4>
              <textarea rows={30} value={inputYamlText} onChange={handleYamlChange} />
              <button onClick={saveYaml}>YAMLを保存する</button>
            </div>
            <div>
              <h4>出力(JSON)</h4>
              <textarea disabled rows={30} value={JSON.stringify(outputConfig, null, 2)} />
              <button onClick={saveJson}>JSONを保存する</button>
            </div>
            <div>
              <h4>設定</h4>
              <div>
                <span>画像の大きさは <b>{(imageScale * 100).toFixed(0)}%</b> です。</span>
                <input
                  type="range"
                  id="scale"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={imageScale}
                  onChange={handleScaleChange}
                  style={{ width: '300px' }}
                />
              </div>
              <hr />
              <h4>生成結果</h4>
              生成された座標数は {outputConfig.map.mappings.length} 座標です。
              <hr />
              画像の幅={imageRawData.width}<br />
              画像の高さ={imageRawData.height}<br />
              <hr />
              URL：<code>{inputConfig.tweet.url || 'null'}</code><br />
              アカウント名：<code>{inputConfig.tweet.related || 'null'}</code><br />
              ハッシュタグ：<code>{inputConfig.tweet.hashtags || 'null'}</code><br />
              <hr />
              {
                !inputYamlError && <div className='yaml_error'>入力のエラーはありません</div>
              }
              {
                inputYamlError && <div className='yaml_error'>入力にエラーがあります：<br />{inputYamlError}</div>
              }
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
