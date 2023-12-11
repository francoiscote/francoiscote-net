export default function Page() {
  return (
    <>
      <h1>Styleguide</h1>
      <Section>
        <h2>Colors</h2>
        <Example>
          <div className="flex justify-between">
            <ColorCard name="Black" hex="#212121" />
            <ColorCard name="Primary" hex="#30475e" />
            <ColorCard name="Secondary" hex="#f05454" />
            <ColorCard name="White" hex="#F2F2F2" />
          </div>
        </Example>
      </Section>

      <Section>
        <Example>
          <h1>Heading 1</h1>
          <h2>Heading 2</h2>
          <h3>Heading 3</h3>
          <h4>Heading 4</h4>
          <h5>Heading 5</h5>
          <h6>Heading 6</h6>
        </Example>
      </Section>

      <Section>
        <h2>Prose example</h2>
        <p className="lead">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque orci
          magna, eleifend suscipit ornare sed, consectetur vel purus. Etiam
          imperdiet urna sed hendrerit vehicula. Sed vitae purus magna. Sed eu
          pharetra ligula. Nam venenatis tincidunt tristique. In vel ornare
          nibh. Integer vestibulum tortor libero, ut interdum urna gravida sit
          amet. Curabitur accumsan ex nunc, ut eleifend est aliquam id. Vivamus
          eu cursus augue. Vestibulum ante ipsum primis in faucibus orci luctus
          et ultrices posuere cubilia curae; Sed non nisi felis. Vestibulum non
          ligula magna. Ut varius, urna vel convallis interdum, enim eros
          egestas purus, in aliquet diam tellus ut est. Mauris tincidunt vitae
          orci eu efficitur. Vestibulum at metus eu leo egestas sollicitudin eu
          vitae felis. Donec ullamcorper nibh quis placerat lobortis.
        </p>
      </Section>
    </>
  );
}

const ColorCard = ({ name, hex }) => (
  <div>
    <div
      className="w-20 h-20 rounded border-gray-200"
      style={{ background: hex }}
    />
    <p className="font-sm">{name}</p>
  </div>
);

const Section = ({ children }) => <div className="mb-16">{children}</div>;

const Example = ({ children }) => (
  <div className="bg-white p-8 border border-gray-200 rounded">{children}</div>
);
