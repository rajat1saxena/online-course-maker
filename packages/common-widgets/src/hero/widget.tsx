import React from "react";
import { WidgetProps } from "@courselit/common-models";
import Settings from "./settings";
import { Image, TextRenderer, Button } from "@courselit/components-library";

export default function Widget({
    settings: {
        title,
        description,
        buttonCaption,
        buttonAction,
        media,
        youtubeLink,
        alignment = "left",
        backgroundColor,
        foregroundColor,
        buttonBackground,
        buttonForeground,
        style = "normal",
        mediaRadius = 0,
    },
}: WidgetProps<Settings>) {
    const hasHeroGraphic = youtubeLink || (media && media.mediaId);
    let direction: "md:!flex-row" | "md:!flex-row-reverse";
    switch (alignment) {
        case "left":
            direction = "md:!flex-row";
            break;
        case "right":
            direction = "md:!flex-row-reverse";
            break;
        default:
            direction = "md:!flex-row";
    }

    return (
        <div className={`${style === "card" ? "p-4" : "p-0"}`}>
            <div
                className={`flex gap-2 justify-between items-center p-4 flex-col ${direction}`}
                style={{
                    backgroundColor:
                        style === "card"
                            ? backgroundColor || "#eee"
                            : backgroundColor,
                    color: foregroundColor,
                    borderRadius: style === "card" ? 2 : 0,
                }}
            >
                {hasHeroGraphic && (
                    <div
                        className={`sm:w-full sm:mb-2 sm:pr-0 sm:pl-0 md:w-1/2 md:mb-0 ${
                            hasHeroGraphic && alignment === "right"
                                ? "md:pl-1"
                                : "md:pl-0"
                        } ${
                            hasHeroGraphic && alignment === "right"
                                ? "md:pl-1"
                                : "md:pl-0"
                        }`}
                    >
                        {youtubeLink && (
                            <div
                                className="relative overflow-hidden"
                                style={{
                                    paddingBottom: "56.25%",
                                    borderRadius: `${mediaRadius}px`,
                                }}
                            >
                                <iframe
                                    className="related left-0 top-0 w-full h-full"
                                    src={`https://www.youtube.com/embed/${youtubeLink}`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        )}
                        {!youtubeLink && media && media.mediaId && (
                            <div
                                className="w-full text-center"
                                style={{
                                    borderRadius: `${mediaRadius}px`,
                                    width: "100%",
                                }}
                            >
                                <Image src={media.file} />
                            </div>
                        )}
                    </div>
                )}
                <div
                    className={`sm:w-full ${
                        hasHeroGraphic ? "md:w-1/2" : "md:w-full"
                    } sm:pr-0 sm:pl-0 ${
                        hasHeroGraphic && alignment === "right"
                            ? "md:pr-1"
                            : "md:pr-0"
                    } ${
                        hasHeroGraphic && alignment === "left"
                            ? "md:pl-1"
                            : "md:pl-0"
                    }`}
                >
                    <div className="flex flex-col">
                        <h2 className="mb-4 text-4xl">{title}</h2>
                        {description && (
                            <div
                                className={`${
                                    buttonAction && buttonCaption
                                        ? "mb-8"
                                        : "mb-0"
                                }`}
                            >
                                <TextRenderer json={description} />
                            </div>
                        )}
                        {buttonAction && buttonCaption && (
                            <div className="flex">
                                <Button
                                    href={buttonAction}
                                    component="link"
                                    style={{
                                        backgroundColor: buttonBackground,
                                        color: buttonForeground,
                                    }}
                                >
                                    {buttonCaption}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
