import {ParsedRequest, ButtonStyle, FileType} from '../api/_lib/types';

const {H, R, copee} = (window as any);
let timeout = -1;

interface ImagePreviewProps {
    src: string;
    onload: () => void;
    onerror: () => void;
    loading: boolean;
}

const ImagePreview = ({src, onload, onerror, loading}: ImagePreviewProps) => {
    const style = {
        filter: loading ? 'blur(5px)' : '',
        opacity: loading ? 0.1 : 1,
    };
    const title = 'Click to copy image URL to clipboard';
    return H('div',
        {className: 'image-wrapper'},
        H('img',
            {src, onload, onerror, style, title}
        )
    );
}

interface DropdownOption {
    text: string;
    value: any;
}

interface DropdownProps {
    options: DropdownOption[];
    value: string;
    onchange: (val: string) => void;
    small: boolean;
}

const Dropdown = ({options, value, onchange, small}: DropdownProps) => {
    const wrapper = small ? 'select-wrapper small' : 'select-wrapper';
    const arrow = small ? 'select-arrow small' : 'select-arrow';
    return H('div',
        {className: wrapper},
        H('select',
            {onchange: (e: any) => onchange(e.target.value)},
            options.map(o =>
                H('option',
                    {value: o.value, selected: value === o.value},
                    o.text
                )
            )
        ),
        H('div',
            {className: arrow},
            '▼'
        )
    );
}

interface TextInputProps {
    value: string;
    oninput: (val: string) => void;
    small: boolean;
    placeholder?: string;
    type?: string
}

const TextInput = ({value, oninput, small, type = 'text', placeholder = ''}: TextInputProps) => {
    return H('div',
        {className: 'input-outer-wrapper' + (small ? ' small' : '')},
        H('div',
            {className: 'input-inner-wrapper'},
            H('input',
                {type, value, placeholder, oninput: (e: any) => oninput(e.target.value)}
            )
        )
    );
}

interface FieldProps {
    label: string;
    input: any;
}

const Field = ({label, input}: FieldProps) => {
    return H('div',
        {className: 'field'},
        H('label',
            H('div', {className: 'field-label'}, label),
            H('div', {className: 'field-value'}, input),
        ),
    );
}

interface ToastProps {
    show: boolean;
    message: string;
}

const Toast = ({show, message}: ToastProps) => {
    const style = {transform: show ? 'translate3d(0,-0px,-0px) scale(1)' : ''};
    return H('div',
        {className: 'toast-area'},
        H('div',
            {className: 'toast-outer', style},
            H('div',
                {className: 'toast-inner'},
                H('div',
                    {className: 'toast-message'},
                    message
                )
            )
        ),
    );
}

const styleOptions: DropdownOption[] = [
    {text: 'Secondary', value: 'secondary'},
    {text: 'Primary', value: 'primary'},
];

const fileTypeOptions: DropdownOption[] = [
    {text: 'PNG', value: 'png'},
    {text: 'JPEG', value: 'jpeg'},
];

const fontSizeOptions: DropdownOption[] = Array
    .from({length: 10})
    .map((_, i) => 14 + i)
    .map(n => ({text: n + 'px', value: n}));

interface AppState extends ParsedRequest {
    loading: boolean;
    showToast: boolean;
    messageToast: string;
    overrideUrl: URL | null;
}

type SetState = (state: Partial<AppState>) => void;

const App = (_: any, state: AppState, setState: SetState) => {
    const setLoadingState = (newState: Partial<AppState>) => {
        window.clearTimeout(timeout);
        if (state.overrideUrl && state.overrideUrl !== newState.overrideUrl) {
            newState.overrideUrl = state.overrideUrl;
        }
        if (newState.overrideUrl) {
            timeout = window.setTimeout(() => setState({overrideUrl: null}), 200);
        }

        setState({...newState, loading: true});
    };
    const copyCode = (e: Event, code: string) => {
        e.preventDefault();
        const success = copee.toClipboard(code);
        if (success) {
            setState({showToast: true, messageToast: 'Copied Code to clipboard'});
            setTimeout(() => setState({showToast: false}), 3000);
        } else {
            setState({
                showToast: true,
                messageToast: 'Could not copy code to clipboard. Please check your browser settings.'
            });
            setTimeout(() => setState({showToast: false}), 3000);
        }
        return false;
    };
    const {
        fileType = 'png',
        fontSize = 14,
        style = 'secondary',
        text = 'Button',
        width = 105,
        height = 32,
        showToast = false,
        messageToast = '',
        loading = true,
        overrideUrl = null,
    } = state;

    const url = new URL(window.location.origin);
    url.pathname = `${encodeURIComponent(text)}.${fileType}`;
    url.searchParams.append('style', style);
    url.searchParams.append('fontSize', fontSize.toString());
    url.searchParams.append('width', width.toString());
    url.searchParams.append('height', height.toString());
    return H('div',
        {className: 'split'},
        H('div',
            {className: 'pull-left'},
            H(ImagePreview, {
                src: overrideUrl ? overrideUrl.href : url.href,
                loading: loading,
                onload: () => setState({loading: false}),
                onerror: () => {
                    setState({showToast: true, messageToast: 'Oops, an error occurred'});
                    setTimeout(() => setState({showToast: false}), 2000);
                },
            })
        ),
        H('div',
            {className: 'pull-right'},
            H('div',
                H('div',
                    {className: 'copy-wrapper'},
                    H(
                        'button',
                        {
                            onclick: (e: Event) => copyCode(
                                e,
                                `[![${state.text ?? "Button"}](${state.overrideUrl ? state.overrideUrl.href : url.href})](https://example.com)`
                            )
                        },
                        'Copy Markdown Code'
                    ),
                    H(
                        'button',
                        {
                            onclick: (e: Event) => copyCode(
                                e,
                                `<a href="https://example.com"><img src="${state.overrideUrl ? state.overrideUrl.href : url.href}" alt="${state.text ?? "Button"}"/></a>`
                            )
                        },
                        'Copy HTML Code'
                    )
                ),
                H(Field, {
                    label: 'Style',
                    input: H(Dropdown, {
                        options: styleOptions,
                        value: style,
                        onchange: (val: ButtonStyle) => {
                            setLoadingState({style: val});
                        }
                    })
                }),
                H(Field, {
                    label: 'File Type',
                    input: H(Dropdown, {
                        options: fileTypeOptions,
                        value: fileType,
                        onchange: (val: FileType) => setLoadingState({fileType: val})
                    })
                }),
                H(Field, {
                    label: 'Font Size',
                    input: H(Dropdown, {
                        options: fontSizeOptions,
                        value: fontSize,
                        onchange: (val: number) => setLoadingState({fontSize: val})
                    })
                }),
                H(Field, {
                    label: 'Width',
                    input: H(TextInput, {
                        options: {type: 'number'},
                        value: width,
                        oninput: (val: number) => {
                            console.log('oninput ' + val);
                            setLoadingState({width: val});
                        }
                    })
                }),
                H(Field, {
                    label: 'Height',
                    input: H(TextInput, {
                        options: {type: 'number'},
                        value: height,
                        oninput: (val: number) => {
                            console.log('oninput ' + val);
                            setLoadingState({height: val});
                        }
                    })
                }),
                H(Field, {
                    label: 'Text Input',
                    input: H(TextInput, {
                        value: text,
                        oninput: (val: string) => {
                            console.log('oninput ' + val);
                            setLoadingState({text: val, overrideUrl: url});
                        }
                    })
                })
            )
        ),
        H(Toast, {
            message: messageToast,
            show: showToast,
        })
    );
};

R(H(App), document.getElementById('app'));
